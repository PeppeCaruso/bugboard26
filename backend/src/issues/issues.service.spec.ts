import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { Issue, IssueStatus, IssueType, IssuePriority } from './issue.entity';
import { User, UserRole } from '../users/user.entity';

describe('IssuesService', () => {
  let service: IssuesService;

  const mockManager = { findOne: jest.fn() };
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    manager: mockManager,
  };

  const author = {
    id: 1,
    email: 'mario.rossi@test.it',
    firstName: 'Mario',
    lastName: 'Rossi',
    role: UserRole.USER,
  } as User;

  const existingIssue = (): Issue =>
    ({
      id: 10,
      title: 'Bug login',
      description: 'Il login non funziona',
      type: IssueType.BUG,
      status: IssueStatus.TODO,
      archived: false,
      author,
      assignee: null,
    }) as unknown as Issue;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuesService,
        { provide: getRepositoryToken(Issue), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<IssuesService>(IssuesService);

    mockRepository.create.mockImplementation((data) => ({ ...data }));
    mockRepository.save.mockImplementation((issue) =>
      Promise.resolve({ id: 10, ...issue }),
    );
  });

  // ---------------- create(dto, author) ----------------
  describe('create', () => {
    it('crea una issue con soli campi obbligatori, stato todo e non archiviata', async () => {
      const dto = { title: 'Titolo', description: 'Descrizione', type: IssueType.BUG };

      const result = await service.create(dto as any, author);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        author,
        status: IssueStatus.TODO,
        archived: false,
      });
      expect(result.status).toBe(IssueStatus.TODO);
      expect(result.archived).toBe(false);
      expect(result.author).toEqual(author);
      expect(result.priority).toBeUndefined();
      expect(result.imageName).toBeUndefined();
    });

    it('crea una issue con priorità e immagine opzionali', async () => {
      const dto = {
        title: 'Titolo',
        description: 'Descrizione',
        type: IssueType.FEATURE,
        priority: IssuePriority.HIGH,
        imageName: 'photo-123.png',
      };

      const result = await service.create(dto as any, author);

      expect(result.priority).toBe(IssuePriority.HIGH);
      expect(result.imageName).toBe('photo-123.png');
      expect(result.status).toBe(IssueStatus.TODO);
    });

    it('forza lo stato todo anche se il dto contiene uno stato diverso', async () => {
      const dto = {
        title: 'Titolo',
        description: 'Descrizione',
        type: IssueType.BUG,
        status: IssueStatus.DONE,
      };

      const result = await service.create(dto as any, author);

      expect(result.status).toBe(IssueStatus.TODO);
    });
  });

  // ---------------- assign(id, assigneeId) ----------------
  describe('assign', () => {
    it('assegna la issue a un utente esistente', async () => {
      const assignee = { id: 2, firstName: 'Laura', lastName: 'Russo' } as User;
      mockRepository.findOne.mockResolvedValue(existingIssue());
      mockManager.findOne.mockResolvedValue(assignee);

      const result = await service.assign(10, 2);

      expect(mockManager.findOne).toHaveBeenCalledWith(User, { where: { id: 2 } });
      expect(result.assignee).toEqual(assignee);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('rimuove l\'assegnazione quando assigneeId è null', async () => {
      const issue = existingIssue();
      issue.assignee = { id: 2 } as User;
      mockRepository.findOne.mockResolvedValue(issue);

      const result = await service.assign(10, null);

      expect(mockManager.findOne).not.toHaveBeenCalled();
      expect(result.assignee).toBeNull();
    });

    it('lancia NotFoundException se l\'utente da assegnare non esiste', async () => {
      mockRepository.findOne.mockResolvedValue(existingIssue());
      mockManager.findOne.mockResolvedValue(null);

      await expect(service.assign(10, 99)).rejects.toThrow(NotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('lancia NotFoundException se la issue non esiste', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.assign(999, 2)).rejects.toThrow(NotFoundException);
      expect(mockManager.findOne).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  // ---------------- updateStatus(id, status) ----------------
  describe('updateStatus', () => {
    it('aggiorna lo stato di una issue esistente', async () => {
      mockRepository.findOne.mockResolvedValue(existingIssue());

      const result = await service.updateStatus(10, IssueStatus.IN_PROGRESS);

      expect(result.status).toBe(IssueStatus.IN_PROGRESS);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('lancia NotFoundException se la issue non esiste', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(999, IssueStatus.DONE)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});