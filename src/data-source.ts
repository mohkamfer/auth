import "reflect-metadata"
import { DataSource } from "typeorm"
import { Permission } from "./entity/Permission"
import { Role } from "./entity/Role"
import { User } from "./entity/User"

export const Database = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User, Role, Permission],
  migrations: [],
  subscribers: [],
})
