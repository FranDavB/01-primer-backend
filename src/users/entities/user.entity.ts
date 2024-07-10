// Este componente es para definir la tabla en la DB

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "src/posts/entities/post.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn() // Esta va a ser la PK
    id: number

    @Column({ default: "" }) // Default por si falta algun dato desde el Front
    nombre: string

    @Column({ default: "" })
    apellido: string;

    @Column({ type: 'text', default: () => "CURRENT_TIMESTAMP" }) //SQLite no soporta timestap ni otros formatos. Debe usarse este formato
    cumpleanios: Date;

    @Column({ default: "" })
    dni: number;

    @OneToMany(() => Post, post => post.autor)
    posts: Post[];
  
}


