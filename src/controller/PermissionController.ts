import { Database } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Permission } from "../entity/Permission"
import { validatePermission } from "../util/validation.utils"
import { validNumber } from "../util/util"

export class PermissionController {
  private permissionRepository = Database.manager.getRepository(Permission)

  async all(request: Request, response: Response, next: NextFunction) {
    this.permissionRepository.find()
      .then((permissions: Permission[]) => {
        if (permissions)
          return response.status(200).json(permissions)
        else
          return response.status(500).json({ error: 'Failed to get permissions.' })
      })
  }

  async getOnePermission(id: number, request: Request, response: Response, next: NextFunction) {
    return this.permissionRepository.countBy({ id })
      .then((actualCount: number) => {
        if (actualCount < 1)
          response.status(404).json({ error: `Permission with ID ${id} was not found` })
        else
          return this.permissionRepository.findOneBy({ id })
            .then((permission: Permission) => {
              if (permission) {
                return permission
              } else
                response.status(500).json({ error: 'Failed to get permission.' })
            })
      })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.id))
      return response.status(400).json({ error: 'id must be a positive number.' })
    const id: number = parseInt(request.params.id)
    const permission: Permission = await this.getOnePermission(id, request, response, next)
    response.status(200).json(permission)
  }

  async insert(request: Request, response: Response, next: NextFunction) {
    // validate object properties
    if (!(await validatePermission(request, response, next))) return
    this.permissionRepository.save(request.body)
      .then((permission: Permission) => {
        if (permission)
          response.status(200).json(permission)
        else
          response.status(500).json({ error: 'Failed to insert permission.' })
      })
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    if (!validNumber(request.params.id))
      return response.status(400).json({ error: 'id must be a positive number.' })
    const id: number = parseInt(request.params.id)
    const permissionToRemove: Permission = await this.getOnePermission(id, request, response, next)
    if (!permissionToRemove) return
    this.permissionRepository.remove(permissionToRemove).then(() => {
      response.status(200).json({ message: `Permission ${id} removed successfully!` })
    })
  }
}
