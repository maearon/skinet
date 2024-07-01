import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Micropost } from '../shared/models/micropost';
import { User as UserCreate } from '../shared/models/user';

export interface ListParams {
  page?: number;
  [key: string]: any;
}

export interface ListResponse<T> {
  users: T[];
  total_count: number;
}

export interface User {
  readonly id: number;
  name: string;
  gravatar_id: string;
  size: number;
}

export interface CreateParams {
  user: SignUpField;
}

export interface SignUpField {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreateResponse<T> {
  user?: T;
  flash?: [message_type: string, message: string];
  error?: string[];
}

export interface UserShow {
  readonly id: number;
  name: string;
  gravatar_id: string;
  size: number;
  following: number;
  followers: number;
  current_user_following_user: boolean;
}

export interface ShowResponse<T> {
  user: T;
  id_relationships?: number;
  microposts: Micropost[];
  total_count: number;
}

export interface UserEdit {
  name: string;
  email: string;
}

export interface EditResponse {
  user: UserEdit;
  gravatar: string;
  flash?: [message_type: string, message: string];
}

export interface UpdateParams {
  user: UpdateField;
}

export interface UpdateField {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateResponse {
  flash_success?: [message_type: string, message: string];
  error?: string[];
}

export interface Response {
  flash?: [message_type: string, message: string];
}

export interface UserFollow {
  readonly id: number;
  name: string;
  gravatar_id: string;
  size: number;
}

export interface FollowResponse<T, U> {
  users: T[];
  xusers: T[];
  total_count: number;
  user: U;
}

export interface IUserFollow {
  readonly id: number;
  name: string;
  followers: number;
  following: number;
  gravatar: string;
  micropost: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  index(params: ListParams): Observable<ListResponse<User>> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.append(key, params[key]);
      }
    }
    return this.http.get<ListResponse<User>>(this.apiUrl, { params: httpParams });
  }

  create(params: CreateParams): Observable<CreateResponse<UserCreate>> {
    return this.http.post<CreateResponse<UserCreate>>(this.apiUrl, params);
  }

  show(id: string, params: ListParams): Observable<ShowResponse<UserShow>> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.append(key, params[key]);
      }
    }
    return this.http.get<ShowResponse<UserShow>>(`${this.apiUrl}/${id}`, { params: httpParams });
  }

  edit(id: string): Observable<EditResponse> {
    return this.http.get<EditResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: string, params: UpdateParams): Observable<UpdateResponse> {
    return this.http.patch<UpdateResponse>(`${this.apiUrl}/${id}`, params);
  }

  destroy(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.apiUrl}/${id}`);
  }

  follow(id: string, page: number, lastUrlSegment: string): Observable<FollowResponse<UserFollow, IUserFollow>> {
    let httpParams = new HttpParams().set('page', page.toString());
    return this.http.get<FollowResponse<UserFollow, IUserFollow>>(`${this.apiUrl}/${id}/${lastUrlSegment}`, { params: httpParams });
  }
}
