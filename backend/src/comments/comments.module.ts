import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { Issue } from '../issues/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Issue])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}