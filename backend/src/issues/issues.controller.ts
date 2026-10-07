import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';

@Controller('issues')
@UseGuards(AuthGuard('jwt'))
export class IssuesController {
  constructor(private issuesService: IssuesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
          filename: (req, file, cb) => {
      cb(null, `photo-${randomUUID()}${extname(file.originalname)}`);
    },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(new Error('Solo immagini sono permesse'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async create(
    @Body() createIssueDto: CreateIssueDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (file) {
      createIssueDto.imageName = file.filename;
    }
    return this.issuesService.create(createIssueDto, req.user);
  }

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.issuesService.findAll({ type, status, priority, dateFrom, dateTo });
  }

  @Get('stats')
  async getStats() {
    return this.issuesService.getStats();
  }

  @Get('assigned')
  async findAssignedToUser(@Request() req) {
    return this.issuesService.findAssignedToUser(req.user.id);
  }

  @Get('archived')
  async findArchived() {
    return this.issuesService.findArchived();
  }

  @Patch(':id/unarchive')
  async unarchive(@Param('id') id: string) {
    return this.issuesService.unarchive(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.issuesService.findOne(+id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.issuesService.updateStatus(+id, status);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.issuesService.archive(+id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.issuesService.delete(+id);
  }

  @Patch(':id/assign')
  async assign(@Param('id') id: string, @Body('assigneeId') assigneeId: number | null) {
    return this.issuesService.assign(+id, assigneeId);
  }
}