import { IssueType, IssuePriority } from '../issue.entity';

export class CreateIssueDto {
  title: string;
  description: string;
  type: IssueType;
  priority?: IssuePriority;
  imageName?: string;
}