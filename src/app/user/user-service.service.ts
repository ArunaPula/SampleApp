import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Response } from "@angular/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { Router } from '@angular/router';
@Injectable()
export class UserServiceService {
  readonly rootUrl = 'http://10.138.77.141:8011';
  constructor(private http: HttpClient,private _http:Http,private router:Router) { }

  
  userAuthentication(userName, password) {
    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader }).catch(this.handleError);
  }
  public handleError(error: Response) {
    if(error.status===400)    
   return Observable.throw(error.json().error || 'Server error');  
 }
}