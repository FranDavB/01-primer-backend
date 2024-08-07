import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Credenciale {
@PrimaryColumn()
id: number

@Column()
dni: number

@Column()
contraseña: string

@Column()
refresh_token: string

@OneToOne(() => User, user => user.credenciale, { onDelete: 'CASCADE' })
@JoinColumn()  // Especifica que esta es la columna de unión
user: User;

}
