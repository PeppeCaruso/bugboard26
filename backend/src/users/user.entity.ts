import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Issue } from '../issues/issue.entity';
import { Comment } from '../comments/comment.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() //genera ID automatico per ogni utente
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ 
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  //relazioni con le altre entità
  @OneToMany(() => Issue, (issue) => issue.author)
  issues: Issue[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}