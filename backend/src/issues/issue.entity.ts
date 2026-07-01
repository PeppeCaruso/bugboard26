import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';

export enum IssueType {
  QUESTION = 'question',
  BUG = 'bug',
  DOCUMENTATION = 'documentation',
  FEATURE = 'feature',
}

export enum IssueStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: IssueType,
  })
  type: IssueType;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.TODO,
  })
  status: IssueStatus;

  @Column({
    type: 'enum',
    enum: IssuePriority,
    nullable: true,
  })
  priority: IssuePriority;

  @Column({ nullable: true })
  imageName: string;

  @Column({ default: false })
  archived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  ////relazioni con le altre entità
  @ManyToOne(() => User, (user) => user.issues)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[];
}