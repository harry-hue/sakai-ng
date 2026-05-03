import { environment } from '@/env/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

 login(model: any) {
  return this.http.post(
    `${environment.apiBaseUrl}${environment.endpoints.login}`,
    model
  );
}

 Register(model: any) {
  return this.http.post(
    `${environment.apiBaseUrl}${environment.endpoints.signup}`,
    model
  );
}
}