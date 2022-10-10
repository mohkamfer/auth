import { Database } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Permission } from "../entity/Permission"
import { Role } from "../entity/Role"
import { Repository } from "typeorm"

export async function authorized(permissions, request: Request, response: Response, next: NextFunction) {
  let authorized: boolean = false
  for (const permission of permissions) {
    // @ts-ignore
    if (request.user.permissions.some((p: Permission) => p.id === permission)) { // check user permissions directly
      authorized = true
    } else { // expand serach to roles
      const roleRepository: Repository<Role> = Database.manager.getRepository(Role)
      const roles: Role[] = await roleRepository.createQueryBuilder("role") // query builder is used to return relations in result set
        .leftJoinAndSelect("role.permissions", "permission")
        .getMany()
      // @ts-ignore
      const userRoles: Role[] = request.user.roles
      for (let userRole of userRoles) {
        for (let role of roles) {
          if (role.permissions.some((p: Permission) => p.id === permission)) {
            // one of the role's permissions matches our target permission
            if (userRole.id === role.id) authorized = true
          }
        }
      }
    }
  }

  return authorized
}
