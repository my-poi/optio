import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { config } from '../config';

@Injectable()
export class LoginService {

  constructor(private http: Http) { }

  login(callback: any) {
    const body = { userName: 'm.tokarz', password: 'password' };
    this.http.post(config.apiBaseUrl + 'public/login', body).subscribe(response => {
      const responseJson = response.json();
      sessionStorage.token = responseJson.token;
      sessionStorage.userId = responseJson.userId;
      callback();
    });
  }
}
