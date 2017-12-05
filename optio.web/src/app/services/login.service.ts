import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { config } from '../config';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  login(callback) {
    const body = { email: 'email', password: 'password' };
    this.http.post(config.apiBaseUrl + 'public/users/login', body).subscribe(response => {
      localStorage.token = response.json().token;
      callback();
    });
  }
}
