import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Issue } from '../issues/issue.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
  ) {}

  async create(issueId: number, content: string, author: User): Promise<Comment> {
    const issue = await this.issueRepository.findOne({ where: { id: issueId } });
    if (!issue) throw new NotFoundException(`Issue #${issueId} non trovata`);

    const comment = this.commentRepository.create({
      content,
      author,
      issue,
    });

    return this.commentRepository.save(comment);
  }
}