import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http,RequestOptions, Headers } from '@angular/http';
import { Response } from "@angular/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { User,Roles } from './usermodel';
import { Router } from '@angular/router';
@Injectable()
export class LoginService {
  readonly rootUrl = 'http://10.138.77.141:8011';
  constructor(private http: HttpClient,private _http:Http,private router:Router) { }

  registerUser(user: User) {
    const body: User = {
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      RoleID:user.RoleID
    }
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(this.rootUrl + '/api/User/Register', body,{headers : reqHeader});
  }

  userAuthentication(userName, password) {
    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader }).catch(this.handleError);
  }

  getUserClaims(){
   return this.http.get(this.rootUrl+'/api/GetUserClaims').catch(this.handleError);
  }
  public POSTFile(file:File)
  {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      formData.append("iD", "Hello");
      formData.append("iD1", "Hello1");
      var data = file;
      //blob = new Blob([data], { type: 'application/json' }),
      formData.append("file", new Blob([data], { type: 'application/json' }),file.name);
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              if (xhr.status == 201) {
                  resolve(JSON.parse(xhr.response));

              } else {
                  reject(JSON.parse(xhr.response));
              }
          }
      }
      xhr.open("POST", "http://10.138.77.141:8011/api/Values/UploadJsonFile", true);
      xhr.send(formData);
  });
  }
  getRoles():Observable<Roles[]>{
    return this._http.get(this.rootUrl+'/api/User/GetRoles').map((res:Response) => <Roles[]> res.json());
   }
   public handleError(error: Response) {
     if(error.status===400)    
    return Observable.throw(error.json().error || 'Server error');  
  } 
}