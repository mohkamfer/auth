import { Request } from "express"
import { Database } from "../data-source"
import { User } from "../entity/User"
import { correctPassword } from "../util/util"

const passport = require("passport")
const LocalStrategy = require("passport-local")

const userRepository = Database.manager.getRepository(User)

passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, callback) {
  userRepository.findOneBy({ email })
    .then(user => {
      if (!user)
        return callback(null, false, { message: 'Invalid credentials' })
      if (correctPassword(password, user.password)) {
        return callback(null, user)
      } else {
        return callback(null, false, { message: 'Invalid credentials' })
      }
    }).catch(error => callback(error))
}))

passport.serializeUser(async function (user, callback) {
  // user id is passed instead of whole object, so we always get latest data from database upon deserialization
  return callback(null, user.id)
})

passport.deserializeUser(async function (request: Request, id, callback) {
  userRepository.createQueryBuilder("user") // query builder is used to include relations in result set
    .leftJoinAndSelect("user.roles", "role")
    .leftJoinAndSelect("user.permissions", "permission")
    .where("user.id = :id", { id })
    .getOne()
    .then(user => {
      return callback(null, {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions
      })
    }).catch(callback)
})

export default passport
