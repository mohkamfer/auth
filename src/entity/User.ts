import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Permission } from "./Permission"
import { Role } from "./Role"

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @ManyToMany(() => Role, (role => role.users))
  @JoinTable()
  roles: Role[]

  @ManyToMany(() => Permission, (permission => permission.users))
  @JoinTable()
  permissions: Permission[]
}
