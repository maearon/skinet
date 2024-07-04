import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CreateParams {
  followed_id: string | string[] | undefined;
}

export interface CreateResponse {
  follow: boolean;
}

export interface DestroyResponse {
  unfollow: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RelationshipApiService {
  private baseUrl = `${environment.apiUrl}/relationships`;

  constructor(private http: HttpClient) {}

  create(params: CreateParams): Observable<CreateResponse> {
    return this.http.post<CreateResponse>(this.baseUrl, params, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  destroy(id: string): Observable<DestroyResponse> {
    return this.http.delete<DestroyResponse>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const rememberToken = localStorage.getItem('remember_token') || sessionStorage.getItem('remember_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token} ${rememberToken}`);
  }
}
