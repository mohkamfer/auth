import { NextFunction, Request, Response } from "express";
import passport = require("passport");
import { Database } from "../data-source";
import { User } from "../entity/User";
import { validateUser } from "../util/validation.utils";

export class AuthController {

  private userRepository = Database.manager.getRepository(User)

  async login(request: Request, response: Response, next: NextFunction) {
    if (request.isAuthenticated()) {
      // @ts-ignore
      return response.status(400).json({ error: `Already logged in as ${request.user.name}!` })
    }

    passport.authenticate('local', (error, user, info) => {
      if (!user)
        return response.status(401).json({ error: 'Login failed.' })
      request.login(user, (error) => {
        if (error)
          return response.status(500).json({ error: 'Login failed.' })
        // @ts-ignore
        response.status(200).json({ message: `Successfully logged in as ${request.user.name}` })
      })
    })(request, response, next)
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    if (!request.isAuthenticated())
      return response.status(400).json({ error: 'Already logged out!' })

    request.logout((error) => {
      if (error) {
        console.error(error)
        response.status(500).json({ error: 'Failed to log out.' })
      } else response.status(200).json({ message: 'Successfully logged out.' })
    })
  }

  async register(request: Request, response: Response, next: NextFunction) {
    if (request.isAuthenticated())
      return response.status(400).json({ error: 'Already logged in! Log out before registering another account.' })

    // user properties validation
    if (!(await validateUser(request, response, next))) return
    this.userRepository.save(request.body)
      .then((user) => {
        if (user) {
          // log in the newly registered user, instead of an extra login step
          request.login(user, error => {
            if (error) {
              console.error(error)
              return response.status(500).json({ error: 'User registered, but log in failed' })
            }

            response.status(201).json({ message: 'User registered and logged in successfully', user })
          })
        } else {
          response.status(500).json({ error: 'User registration failed.' })
        }
      }).catch(error => {
        response.status(500).json({ error: 'User registration failed.', message: error.message })
      })
  }
}
