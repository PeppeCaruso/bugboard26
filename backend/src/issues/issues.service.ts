import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueStatus } from './issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { User } from '../users/user.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
  ) {}

  async create(createIssueDto: CreateIssueDto, author: User): Promise<Issue> {
    const issue = this.issueRepository.create({
      ...createIssueDto,
      author,
      status: IssueStatus.TODO,
      archived: false,
    });
    return this.issueRepository.save(issue);
  }

  async findAll(filters?: {
    type?: string;
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Issue[]> {
    const query = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.author', 'author')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .leftJoinAndSelect('issue.comments', 'comments')
      .where('issue.archived = :archived', { archived: false });

    if (filters?.type) {
      const types = filters.type.split(',');
      query.andWhere('issue.type IN (:...types)', { types });
    }
    if (filters?.status) {
      const statuses = filters.status.split(',');
      query.andWhere('issue.status IN (:...statuses)', { statuses });
    }
    if (filters?.priority) {
      const priorities = filters.priority.split(',');
      query.andWhere('issue.priority IN (:...priorities)', { priorities });
    }
    if (filters?.dateFrom) {
      query.andWhere('issue.createdAt >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters?.dateTo) {
      query.andWhere('issue.createdAt <= :dateTo', { dateTo: filters.dateTo });
    }

    return query.orderBy('issue.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Issue> { //Recupera una singola issue
        const issue = await this.issueRepository.findOne({
            where: { id },
            relations: {
            author: true,
            comments: {
                author: true,
            },
            assignee: true,
            },
        });
        if (!issue) throw new NotFoundException(`Issue #${id} non trovata`);
        return issue;
    }

  async getStats(): Promise<{ todo: number; inProgress: number; done: number }> { //conta le issue per stato
    const [todo, inProgress, done] = await Promise.all([
      this.issueRepository.count({ where: { status: IssueStatus.TODO, archived: false } }),
      this.issueRepository.count({ where: { status: IssueStatus.IN_PROGRESS, archived: false } }),
      this.issueRepository.count({ where: { status: IssueStatus.DONE, archived: false } }),
    ]);
    return { todo, inProgress, done };
  }

  async findAssignedToUser(userId: number): Promise<Issue[]> {
    return this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.author', 'author')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .where('issue.assignee.id = :userId', { userId })
      .andWhere('issue.archived = :archived', { archived: false })
      .andWhere('issue.status != :status', { status: 'done' })
      .orderBy('issue.createdAt', 'DESC')
      .getMany();
  }

  async delete(id: number): Promise<void> {
    await this.issueRepository.delete(id);
  }

  async archive(id: number): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.archived = true;
    return this.issueRepository.save(issue);
  }

  async updateStatus(id: number, status: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.status = status as any;
    return this.issueRepository.save(issue);
  }

  async assign(id: number, assigneeId: number | null): Promise<Issue> {
    const issue = await this.findOne(id);
    if (assigneeId) {
      const assignee = await this.issueRepository.manager.findOne(User, { where: { id: assigneeId } });
      if (!assignee) throw new NotFoundException(`Utente #${assigneeId} non trovato`);
      issue.assignee = assignee;
    } else {
      issue.assignee = null as any;
    }
    return this.issueRepository.save(issue);
  }

  //per le issues archiviate
  async findArchived(): Promise<Issue[]> {
    return this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.author', 'author')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .where('issue.archived = :archived', { archived: true })
      .orderBy('issue.createdAt', 'DESC')
      .getMany();
  }

  //disarchiviare
  async unarchive(id: number): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.archived = false;
    return this.issueRepository.save(issue);
  }
}