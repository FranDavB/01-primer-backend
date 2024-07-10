// Este componente es para definir la tabla en la DB

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn() // Esta va a ser la PK
    id: number

    @Column({ default: "" }) // Default por si falta algun dato desde el Front
    nombre: string

    @Column({ type: 'text', default: () => "CURRENT_TIMESTAMP" }) //SQLite no soporta timestap ni otros formatos. Debe usarse este formato
    fecha: Date;
    
    @Column({ default: "" })
    contenido: string;

    @Column()
    autorId: number; // FK
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Para establecer la cardinalidad de la relacion entre ambas tablas
    @JoinColumn({ name: 'autorId' }) // Esto enlaza la columna autorId con la clave foránea
    autor: User;
      
}


