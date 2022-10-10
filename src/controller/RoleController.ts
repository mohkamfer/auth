import { Database } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Role } from "../entity/Role"
import { validateRole } from "../util/validation.utils"
import { Permission } from "../entity/Permission"
import { validNumber } from "../util/util"

export class RoleController {

  private roleRepository = Database.manager.getRepository(Role)
  private permissionRepository = Database.manager.getRepository(Permission)

  async all(request: Request, response: Response, next: NextFunction) {
    this.roleRepository.find()
      .then((roles: Role[]) => {
        if (roles)
          return response.status(200).json(roles)
        else
          return response.status(500).json({ error: 'Failed to get roles.' })
      })
  }

  async getOneRole(id: number, request: Request, response: Response, next: NextFunction) {
    return this.roleRepository.countBy({ id })
      .then((actualCount: number) => {
        if (actualCount < 1)
          response.status(404).json({ error: `Role with ID ${id} was not found` })
        else
          return this.roleRepository.findOneBy({ id })
            .then((role: Role) => {
              if (role) {
                return role
              } else
                response.status(500).json({ error: 'Failed to get role.' })
            })
      })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.id))
      return response.status(400).json({ error: 'id must be a positive number.' })
    const id: number = parseInt(request.params.id)
    const role: Role = await this.getOneRole(id, request, response, next)
    response.status(200).json(role)
  }

  async insert(request: Request, response: Response, next: NextFunction) {
    // validate object properties
    if (!(await validateRole(request, response, next))) return
    this.roleRepository.save(request.body)
      .then((role: Role) => {
        if (role)
          response.status(200).json(role)
        else
          response.status(500).json({ error: 'Failed to insert role.' })
      })
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.id))
      return response.status(400).json({ error: 'id must be a positive number.' })
    const id: number = parseInt(request.params.id)
    const roleToRemove: Role = await this.getOneRole(id, request, response, next)
    if (!roleToRemove) return
    this.roleRepository.remove(roleToRemove).then(() => {
      response.status(200).json({ message: `Role ${id} removed successfully!` })
    })
  }

  async addPermission(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.roleId))
      return response.status(400).json({ error: 'roleId must be a positive number.' })
    if (!validNumber(request.params.permissionId))
      return response.status(400).json({ error: 'permissionId must be a positive number.' })
    const roleId: number = parseInt(request.params.roleId)
    const permissionId: number = parseInt(request.params.permissionId)
    this.roleRepository.createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .where("role.id = :id", { id: roleId })
      .getOne()
      .then(async role => {
        if (!role)
          return response.status(404).json({ error: `Role ${roleId} not found.` })
        if (role.permissions.some(p => p.id === permissionId))
          return response.status(409).json({ error: 'Role already has this permission.' })
        this.permissionRepository.findOneBy({ id: permissionId })
          .then(permission => {
            if (!permission)
              return response.status(404).json({ error: `Permission ${permissionId} not found.` })
            role.permissions.push(permission)
            this.roleRepository.save(role)
              .then(role => {
                if (!role)
                  return response.status(500).json({ error: 'Failed to add permission.' })
                response.status(200).json({ message: 'Permission added successfully.' })
              })
          })
      })
  }

  async removePermission(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.roleId))
      return response.status(400).json({ error: 'roleId must be a positive number.' })
    if (!validNumber(request.params.permissionId))
      return response.status(400).json({ error: 'permissionId must be a positive number.' })
    const roleId: number = parseInt(request.params.roleId)
    const permissionId: number = parseInt(request.params.permissionId)
    this.roleRepository.createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .where("role.id = :id", { id: roleId })
      .getOne()
      .then(async role => {
        if (!role)
          return response.status(404).json({ error: `Role ${roleId} not found.` })
        if (!role.permissions.some(p => p.id === permissionId))
          return response.status(400).json({ error: 'Role does not have this permission.' })
        this.permissionRepository.findOneBy({ id: permissionId })
          .then(permission => {
            if (!permission)
              return response.status(404).json({ error: `Permission ${permissionId} not found.` })
            role.permissions = role.permissions.filter(p => p.id !== permissionId)
            this.roleRepository.save(role)
              .then(role => {
                if (!role)
                  return response.status(500).json({ error: 'Failed to remove permission.' })
                response.status(200).json({ message: 'Permission removed successfully.' })
              })
          })
      })
  }
}
