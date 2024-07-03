import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateResponse, ListResponse, Micropost } from '../shared/models/micropost';

@Injectable({
  providedIn: 'root'
})
export class MicropostApiService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(page: number): Observable<ListResponse<Micropost>> {
    const apiUrl = 'http://localhost:3001/api'
    return this.http.get<ListResponse<Micropost>>(`${apiUrl}?page=${page}`);
  }

  remove(micropostId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}microposts/${micropostId}`);
  }

  create(formData: FormData): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(`${this.baseUrl}microposts`, formData, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  private getAuthHeaders(): HttpHeaders {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    let rememberToken = localStorage.getItem('remember_token') || sessionStorage.getItem('remember_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token} ${rememberToken}`);
  }
}
