import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { User } from '../shared/models/user';

export interface ListResponse<User> {
  users: User[]
  total_count: number
}

export interface User {
  readonly id: number
  name: string
  gravatar_id: string
  size: number
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersForUser() {
    return this.http.get<ListResponse<User>>(this.baseUrl + 'users');
  }
  getUserDetailed(id: number) {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
}
