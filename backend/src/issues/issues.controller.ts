import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UserRole } from '../users/user.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('issues')
@UseGuards(AuthGuard('jwt'), RolesGuard)
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
        cb(new BadRequestException('Sono ammesse solo immagini JPG, PNG o GIF'), false);
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
  @Roles(UserRole.ADMIN) //solo gli amministratori possono consultare l'archivio
  async findArchived() {
    return this.issuesService.findArchived();
  }

  @Patch(':id/unarchive')
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN) //solo gli amministratori possono archiviare (Funzionalità 13)
  async archive(@Param('id') id: string) {
    return this.issuesService.archive(+id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.issuesService.delete(+id);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN)
  async assign(@Param('id') id: string, @Body('assigneeId') assigneeId: number | null) {
    return this.issuesService.assign(+id, assigneeId);
  }
}