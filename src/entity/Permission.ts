import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Role } from "./Role"
import { User } from "./User"

@Entity()
export class Permission {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Role, (role => role.permissions))
  roles: Role[]

  @ManyToMany(() => User, (user => user.permissions))
  users: User[]
}
