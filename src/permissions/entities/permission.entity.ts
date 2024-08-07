import { Role } from "src/roles/entities/role.entity";
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Permission {

    @PrimaryColumn()
    id: number

    @Column()
    nombre: string

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

}
