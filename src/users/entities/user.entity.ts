import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import { Post } from "src/posts/entities/post.entity";
import { Credenciale } from "src/credenciales/entities/credenciale.entity";
import { Role } from "src/roles/entities/role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "" })
    nombre: string;

    @Column({ default: "" })
    apellido: string;

    @Column({ type: 'text', default: () => "CURRENT_TIMESTAMP" })
    cumpleanios: Date;

    @OneToMany(() => Post, post => post.autor) // Aca no puedo hacer una JoinTable porque es solo en relaciones @ManyToMany
    posts: Post[];

    @OneToOne(() => Credenciale, credenciale => credenciale.user)
    @JoinColumn()  // Especifica que esta es la columna de unión
    credenciale: Credenciale;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
      name: 'user_roles', // Nombre de la tabla intermedia
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];
  
}
