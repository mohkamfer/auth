import { Database } from "../data-source";
import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";
import { User } from "../entity/User";
import { hashPassword, titleCase } from "./util";

export async function initializeRolesAndPermissions() {
  const database = Database

  const permissionRepository = database.manager.getRepository(Permission)
  const roleRepository = database.manager.getRepository(Role)
  const userRepository = database.manager.getRepository(User)

  const permissionCount: number = await permissionRepository.count()
  const adminUserExists: boolean = await userRepository.countBy({ name: titleCase("admin") }) > 0

  if (permissionCount < 1) {
    await permissionRepository.insert({ id: 1, name: "READ_USERS" })
    await permissionRepository.insert({ id: 2, name: "SAVE_USERS" })
    await permissionRepository.insert({ id: 3, name: "DELETE_USERS" })
    await permissionRepository.insert({ id: 4, name: "ADD_USER_PERMISSION" })
    await permissionRepository.insert({ id: 5, name: "DELETE_USER_PERMISSION" })
    await permissionRepository.insert({ id: 6, name: "ADD_USER_ROLE" })
    await permissionRepository.insert({ id: 7, name: "DELETE_USER_ROLE" })
    await permissionRepository.insert({ id: 8, name: "FORCE_LOG_USER_OUT" })

    await permissionRepository.insert({ id: 9, name: "READ_PERMISSIONS" })
    await permissionRepository.insert({ id: 10, name: "SAVE_PERMISSIONS" })
    await permissionRepository.insert({ id: 11, name: "DELETE_PERMISSIONS" })

    await permissionRepository.insert({ id: 12, name: "READ_ROLES" })
    await permissionRepository.insert({ id: 13, name: "SAVE_ROLES" })
    await permissionRepository.insert({ id: 14, name: "DELETE_ROLES" })
    await permissionRepository.insert({ id: 15, name: "ADD_ROLE_PERMISSION" })
    await permissionRepository.insert({ id: 16, name: "DELETE_ROLE_PERMISSION" })

    await roleRepository.save({
      id: 1,
      name: "ADMINISTRATOR",
      permissions: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
        { id: 16 },
      ]
    })

    await roleRepository.save({
      id: 2,
      name: "MODERATOR",
      permissions: [
        { id: 1 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 9 },
        { id: 12 },
        { id: 15 },
        { id: 16 },
      ]
    })

    await roleRepository.save({
      id: 3,
      name: "USER",
      permissions: [
        { id: 1 }
      ]
    })
  }

  if (!adminUserExists) {
    await userRepository.save({
      id: 1,
      name: "admin",
      email: "admin@task.com",
      password: hashPassword("admin"),
      roles: [
        { id: 1 }
      ]
    })
  }
}
