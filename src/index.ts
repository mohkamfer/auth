import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response, NextFunction } from "express"
import { Database } from "./data-source"
import { Routes } from "./routes"
import { handle404 } from "./middleware/errors"
import { initializeRolesAndPermissions } from "./util/database.utils"
import passport from './middleware/passport'
import helmet from "helmet"
import { Permission } from "./entity/Permission"
import { authorized } from "./util/authorization.utils"

const session = require("express-session")
const SQLiteStore = require("connect-sqlite3")(session)
const app = express()

Database.initialize().then(async () => {
  app.use(session({
    // use same typeorm database, instead of creating new one by default
    store: new SQLiteStore({
      db: "database.sqlite",
      dir: ".",
      table: "sessions",
      mode: "",
    }),
    secret: "session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 5 * 1000, // 5 minute
      secure: false
    }
  }))
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.use(passport.session())
  
  // helmet is used for extra security tweaks
  app.use(helmet())
  
  // dynamically load routes
  Routes.forEach(async route => {
    (app as any)[route.method](route.route, async (req: Request, res: Response, next: NextFunction) => {
      if (route.secure && !req.isAuthenticated()) {
        res.sendStatus(401)
      } else {
        if (route.secure && req.isAuthenticated()) {
          if (!(await authorized(route.permissions, req, res, next)))
            return res.sendStatus(401)
        }
        const result = (new (route.controller as any))[route.action](req, res, next)
      }
    })
  })
  
  // a middleware for unregistered routes
  app.use(handle404)
  
  app.listen(3000)
  initializeRolesAndPermissions()
  
  console.log("Express server has started on port 3000.")

  // emitted to emulate a pubsub behavior for test suite
  app.emit('app_started')
}).catch(console.error)

module.exports = app
