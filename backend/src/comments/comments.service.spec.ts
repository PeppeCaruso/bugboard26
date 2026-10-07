import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { Issue } from '../issues/issue.entity';
import { User, UserRole } from '../users/user.entity';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockCommentRepository = { create: jest.fn(), save: jest.fn() };
  const mockIssueRepository = { findOne: jest.fn() };

  const author = { id: 1, firstName: 'Mario', lastName: 'Rossi', role: UserRole.USER } as User;
  const issue = { id: 10, title: 'Bug login' } as Issue;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: mockCommentRepository },
        { provide: getRepositoryToken(Issue), useValue: mockIssueRepository },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);

    mockCommentRepository.create.mockImplementation((data) => ({ ...data }));
    mockCommentRepository.save.mockImplementation((comment) =>
      Promise.resolve({ id: 1, ...comment }),
    );
  });

  it('crea un commento associato alla issue e all\'autore', async () => {
    mockIssueRepository.findOne.mockResolvedValue(issue);

    const result = await service.create(10, 'Confermo il problema', author);

    expect(mockIssueRepository.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
    expect(mockCommentRepository.create).toHaveBeenCalledWith({
      content: 'Confermo il problema',
      author,
      issue,
    });
    expect(result.content).toBe('Confermo il problema');
    expect(result.author).toEqual(author);
    expect(result.issue).toEqual(issue);
  });

  it('lancia NotFoundException se la issue non esiste', async () => {
    mockIssueRepository.findOne.mockResolvedValue(null);

    await expect(service.create(999, 'Commento', author)).rejects.toThrow(NotFoundException);
    expect(mockCommentRepository.create).not.toHaveBeenCalled();
    expect(mockCommentRepository.save).not.toHaveBeenCalled();
  });
});