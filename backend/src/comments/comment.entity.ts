import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Issue } from '../issues/issue.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  //relazioni con le altre entità
  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  //CASCADE: Alla cancellazione di una issue, vengono eliminati in automatico anche i commenti
  @ManyToOne(() => Issue, (issue) => issue.comments, { onDelete: 'CASCADE' })
  issue: Issue;
}