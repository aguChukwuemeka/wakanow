import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}

  // getAllUsers(page: number): Observable<any> {
  //   const url = `${this.apiUrl}?page=${page}`;
  //   return this.http.get(url);
  // }

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getUserByUsername(payload: any): Observable<any> {
    return this.http.get(this.apiUrl, payload);
  }

  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

}
