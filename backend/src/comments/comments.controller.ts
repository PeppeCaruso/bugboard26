import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  async create(@Body() body: { issueId: number; content: string }, @Request() req) {
    return this.commentsService.create(body.issueId, body.content, req.user);
  }
}