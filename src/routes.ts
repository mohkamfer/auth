import { AuthController } from "./controller/AuthController"
import { PermissionController } from "./controller/PermissionController"
import { RoleController } from "./controller/RoleController"
import { UserController } from "./controller/UserController"

export const Routes = [
  /* Auth routes */
  {
    method: "post",
    route: "/login",
    controller: AuthController,
    action: "login",
    secure: false,
    permissions: []
  }, {
    method: "post",
    route: "/logout",
    controller: AuthController,
    action: "logout",
    secure: false,
    permissions: []
  }, {
    method: "post",
    route: "/register",
    controller: AuthController,
    action: "register",
    secure: false,
    permissions: []
  },
  /* User routes */
  {
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    secure: true,
    permissions: [1]
  }, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    secure: true,
    permissions: [1]
  }, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "insert",
    secure: true,
    permissions: [2]
  }, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    secure: true,
    permissions: [3]
  }, {
    method: "patch",
    route: "/users/:userId/permission/:permissionId",
    controller: UserController,
    action: "addPermission",
    secure: true,
    permissions: [4]
  }, {
    method: "delete",
    route: "/users/:userId/permission/:permissionId",
    controller: UserController,
    action: "removePermission",
    secure: true,
    permissions: [5]
  }, {
    method: "patch",
    route: "/users/:userId/role/:roleId",
    controller: UserController,
    action: "addRole",
    secure: true,
    permissions: [6]
  }, {
    method: "delete",
    route: "/users/:userId/role/:roleId",
    controller: UserController,
    action: "removeRole",
    secure: true,
    permissions: [7]
  }, {
    method: "delete",
    route: "/users/:userId/session",
    controller: UserController,
    action: "destroySession",
    secure: true,
    permissions: [8]
  },
  /* Role routes */
  {
    method: "get",
    route: "/roles/",
    controller: RoleController,
    action: "all",
    secure: true,
    permissions: [12]
  }, {
    method: "get",
    route: "/roles/:id",
    controller: RoleController,
    action: "one",
    secure: true,
    permissions: [12]
  }, {
    method: "post",
    route: "/roles",
    controller: RoleController,
    action: "insert",
    secure: true,
    permissions: [13]
  }, {
    method: "delete",
    route: "/roles/:id",
    controller: RoleController,
    action: "remove",
    secure: true,
    permissions: [14]
  }, {
    method: "patch",
    route: "/roles/:roleId/permission/:permissionId",
    controller: RoleController,
    action: "addPermission",
    secure: true,
    permissions: [15]
  }, {
    method: "delete",
    route: "/roles/:roleId/permission/:permissionId",
    controller: RoleController,
    action: "removePermission",
    secure: true,
    permissions: [16]
  },
  /* Permission routes */
  {
    method: "get",
    route: "/permissions",
    controller: PermissionController,
    action: "all",
    secure: true,
    permissions: [9]
  }, {
    method: "get",
    route: "/permissions/:id",
    controller: PermissionController,
    action: "one",
    secure: true,
    permissions: [9]
  }, {
    method: "post",
    route: "/permissions",
    controller: PermissionController,
    action: "insert",
    secure: true,
    permissions: [10]
  }, {
    method: "delete",
    route: "/permissions/:id",
    controller: PermissionController,
    action: "remove",
    secure: true,
    permissions: [11]
  }
]
