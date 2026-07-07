import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  create(dto: CreateUserDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}