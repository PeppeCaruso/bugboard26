import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  priority?: string;
  imageName?: string;
  archived: boolean;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  comments?: IssueComment[];
}

export interface IssueComment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface CreateIssueDto {
  title: string;
  description: string;
  type: string;
  priority?: string;
}

export interface IssueStats {
  todo: number;
  inProgress: number;
  done: number;
}

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private apiUrl = 'http://localhost:3000/issues';

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, formData);
  }

  findAll(filters?: { 
    type?: string; 
    status?: string; 
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Observable<Issue[]> {
    let params = new HttpParams();
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);
    return this.http.get<Issue[]>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<IssueStats> {
    return this.http.get<IssueStats>(`${this.apiUrl}/stats`);
  }

  findAssignedToMe(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/assigned`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  archive(id: number): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}/archive`, {});
  }

  updateStatus(id: number, status: string): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}/status`, { status });
  }

  assign(id: number, assigneeId: number | null): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}/assign`, { assigneeId });
  }

  findArchived(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/archived`);
  }

  unarchive(id: number): Observable<Issue> {
    return this.http.patch<Issue>(`${this.apiUrl}/${id}/unarchive`, {});
  }
}