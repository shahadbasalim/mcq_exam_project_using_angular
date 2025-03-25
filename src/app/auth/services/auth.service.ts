import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  user = new Subject;
  createUser(model: any) {
    return this.http.post(environment.baseApi + 'students', model);
  }

  login(model: any) {
    return this.http.put(environment.baseApi + 'login/a87b', model);
  }
  getUsers(type: string) {
    return this.http.get(environment.baseApi + type);
  }

  getStudent(id: number) {
    return this.http.get(environment.baseApi+"students/" + id);
  }

  updateStudent(id: number, model: any) {
    return this.http.put(environment.baseApi +'students/' + id, model);
  }

  getRole() {
    return this.http.get(environment.baseApi + "login/a87b");
  }
}
