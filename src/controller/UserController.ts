import { Database } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { validateUser } from "../util/validation.utils"
import { Permission } from "../entity/Permission"
import { Role } from "../entity/Role"
import { validNumber } from "../util/util"

export class UserController {

  private userRepository = Database.manager.getRepository(User)
  private permissionRepository = Database.manager.getRepository(Permission)
  private roleRepository = Database.manager.getRepository(Role)

  async all(request: Request, response: Response, next: NextFunction) {
    this.userRepository.find()
      .then((users: User[]) => {
        if (users)
          return response.status(200).json(users.map(({ password, ...properties }) => properties)) // remove password from object
        else
          return response.status(500).json({ error: 'Failed to get users.' })
      })
  }

  async getOneUser(id: number, request: Request, response: Response, next: NextFunction) {
    return this.userRepository.countBy({ id })
      .then((actualCount: number) => {
        if (actualCount < 1)
          response.status(404).json({ error: `User with ID ${id} was not found,` })
        else
          return this.userRepository.findOneBy({ id })
            .then((user: User) => {
              if (user) {
                delete user.password // remove password property from object
                return user
              } else
                response.status(500).json({ error: 'Failed to get user.' })
            })
      })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.id))
      return response.status(400).json({ error: 'id must be a positive number.' })
    const id: number = parseInt(request.params.id)
    const user: User = await this.getOneUser(id, request, response, next)
    response.status(200).json(user)
  }

  async insert(request: Request, response: Response, next: NextFunction) {
    // validate object properties
    if (!(await validateUser(request, response, next))) return
    this.userRepository.save(request.body)
      .then((user: User) => {
        if (user)
          response.status(200).json(user)
        else
          response.status(500).json({ error: 'Failed to insert user,' })
      })
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.id))
      return response.status(400).json({ error: 'id must be a positive number.' })
    const id: number = parseInt(request.params.id)
    const userToRemove: User = await this.getOneUser(id, request, response, next)
    if (!userToRemove) return
    this.userRepository.remove(userToRemove).then(() => {
      response.status(200).json({ message: `User ${id} removed successfully!` })
    })
  }

  async addPermission(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.userId))
      return response.status(400).json({ error: 'userId must be a positive number.' })
    if (!validNumber(request.params.permissionId))
      return response.status(400).json({ error: 'permissionId must be a positive number.' })
    const userId: number = parseInt(request.params.userId)
    const permissionId: number = parseInt(request.params.permissionId)
    this.userRepository.createQueryBuilder("user") // query builder is used to join other relations
      .leftJoinAndSelect("user.permissions", "permission")
      .where("user.id = :id", { id: userId })
      .getOne()
      .then(async user => {
        if (!user)
          return response.status(404).json({ error: `User ${userId} not found.` })
        if (user.permissions.some(p => p.id === permissionId)) // check if any permission matches permissionId
          return response.status(409).json({ error: 'User already has this permission.' })
        this.permissionRepository.findOneBy({ id: permissionId })
          .then(permission => {
            if (!permission)
              return response.status(404).json({ error: `Permission ${permissionId} not found.` })
            user.permissions.push(permission)
            this.userRepository.save(user)
              .then(user => {
                if (!user)
                  return response.status(500).json({ error: 'Failed to add permission.' })
                response.status(200).json({ message: 'Permission added successfully.' })
              })
          })
      })
  }

  async removePermission(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.userId))
      return response.status(400).json({ error: 'userId must be a positive number.' })
    if (!validNumber(request.params.permissionId))
      return response.status(400).json({ error: 'permissionId must be a positive number.' })
    const userId: number = parseInt(request.params.userId)
    const permissionId: number = parseInt(request.params.permissionId)
    this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.permissions", "permission")
      .where("user.id = :id", { id: userId })
      .getOne()
      .then(async user => {
        if (!user)
          return response.status(404).json({ error: `User ${userId} not found.` })
        if (!user.permissions.some(p => p.id === permissionId)) // ensure no permissions match permissionId
          return response.status(400).json({ error: 'User does not have this permission.' })
        this.permissionRepository.findOneBy({ id: permissionId })
          .then(permission => {
            if (!permission)
              return response.status(404).json({ error: `Permission ${permissionId} not found.` })
            user.permissions = user.permissions.filter(p => p.id !== permissionId) // excluse the permissionId we trying to remove
            this.userRepository.save(user)
              .then(user => {
                if (!user)
                  return response.status(500).json({ error: 'Failed to remove permission.' })
                response.status(200).json({ message: 'Permission removed successfully.' })
              })
          })
      })
  }

  async addRole(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.userId))
      return response.status(400).json({ error: 'userId must be a positive number.' })
    if (!validNumber(request.params.roleId))
      return response.status(400).json({ error: 'roleId must be a positive number.' })
    const userId: number = parseInt(request.params.userId)
    const roleId: number = parseInt(request.params.roleId)
    this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .where("user.id = :id", { id: userId })
      .getOne()
      .then(async user => {
        if (!user)
          return response.status(404).json({ error: `User ${userId} not found.` })
        if (user.roles.some(r => r.id === roleId))
          return response.status(409).json({ error: 'User already has this role.' })
        else {
          this.roleRepository.findOneBy({ id: roleId })
            .then(role => {
              if (!role)
                return response.status(404).json({ error: `Role ${roleId} not found.` })
              user.roles.push(role)
              this.userRepository.save(user)
                .then(user => {
                  if (!user)
                    return response.status(500).json({ error: 'Failed to add role.' })
                  response.status(200).json({ message: 'Role added successfully.' })
                })
            })
        }
      })
  }

  async removeRole(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.userId))
      return response.status(400).json({ error: 'userId must be a positive number.' })
    if (!validNumber(request.params.roleId))
      return response.status(400).json({ error: 'roleId must be a positive number.' })
    const userId: number = parseInt(request.params.userId)
    const roleId: number = parseInt(request.params.roleId)
    this.userRepository.createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "role")
      .where("user.id = :id", { id: userId })
      .getOne()
      .then(async user => {
        if (!user)
          return response.status(404).json({ error: `User ${userId} not found.` })
        if (!user.roles.some(r => r.id === roleId))
          return response.status(400).json({ error: 'User does not have this role.' })
        this.roleRepository.findOneBy({ id: roleId })
          .then(role => {
            if (!role)
              return response.status(404).json({ error: `Role ${roleId} not found.` })
            user.roles = user.roles.filter(p => p.id !== roleId)
            this.userRepository.save(user)
              .then(user => {
                if (!user)
                  return response.status(500).json({ error: 'Failed to remove role.' })
                response.status(200).json({ message: 'Role removed successfully.' })
              })
          })
      })
  }

  async destroySession(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.userId))
      return response.status(400).json({ error: 'userId must be a positive number.' })
    const userId: number = parseInt(request.params.userId)
    const user: User = await this.getOneUser(userId, request, response, next)
    const sessions = await Database.manager.query(`SELECT * FROM sessions`)
    let sessionsToDestroy = []
    for (let session of sessions) {
      let sessionData = JSON.parse(session.sess);
      if (sessionData.passport.user === userId)
        sessionsToDestroy.push(session.sid)
    }

    Database.manager.transaction(async (manager) => {
      sessionsToDestroy.forEach(async session => await manager.query("DELETE FROM sessions where sid = '" + session + "'"))
    }).then(() => {
      response.status(200).json({ message: `Ended ${user.name}'s session(s)` })
    }).catch(() => {
      response.status(500).json({ error: `Could not end ${user.name}'s session(s)` })
    })
  }
}
