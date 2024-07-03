import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Micropost } from '../shared/models/micropost';
import { User as UserCreate } from '../shared/models/user';

export interface ListParams {
  page?: number
  [key: string]: any
}

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

export interface CreateParams {
  user: SignUpField
}

export interface SignUpField {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface CreateResponse<UserCreate> {
  user?: UserCreate
  flash?: [message_type: string, message: string]
  error?: string[]
}

export interface UserShow {
  readonly id: number
  name: string
  gravatar_id: string
  size: number
  following: number
  followers: number
  current_user_following_user: boolean
}

export interface ShowResponse<UserShow> {
  user: UserShow
  id_relationships?: number
  microposts: Micropost[]
  total_count: number
}

export interface UserEdit {
  name: string
  email: string
}

export interface EditResponse {
  user: UserEdit
  gravatar: string
  flash?: [message_type: string, message: string]
}

export interface UpdateParams {
  user: UpdateField
}

export interface UpdateField {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UpdateResponse {
  flash_success?: [message_type: string, message: string]
  error?: string[]
}

export interface Response {
  flash?: [message_type: string, message: string]
}

export interface UserFollow {
  readonly id: number
  name: string
  gravatar_id: string
  size: number
}

export interface FollowResponse<UserFollow,IUserFollow> {
  users: UserFollow[]
  xusers: UserFollow[]
  total_count: number
  user: IUserFollow
}

export interface IUserFollow {
  readonly id: number
  name: string
  followers: number
  following: number
  gravatar: string
  micropost: number
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  index(params: ListParams): Observable<ListResponse<User>> {
    return this.http.get<ListResponse<User>>(this.baseUrl, { params });
  }

  create(params: CreateParams): Observable<CreateResponse<User>> {
    return this.http.post<CreateResponse<User>>(this.baseUrl, params);
  }

  show(id: string | null, params: ListParams): Observable<ShowResponse<UserShow>> {
    return this.http.get<ShowResponse<UserShow>>(`${this.baseUrl}/${id}`, { params });
  }

  edit(id: string): Observable<EditResponse> {
    return this.http.get<EditResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: string, params: UpdateParams): Observable<UpdateResponse> {
    return this.http.patch<UpdateResponse>(`${this.baseUrl}/${id}`, params);
  }

  destroy(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.baseUrl}/${id}`);
  }

  follow(id: string, page: number, lastUrlSegment: string): Observable<FollowResponse<UserFollow, IUserFollow>> {
    return this.http.get<FollowResponse<UserFollow, IUserFollow>>(`${this.baseUrl}/${id}/${lastUrlSegment}`, { params: { page } });
  }
}
