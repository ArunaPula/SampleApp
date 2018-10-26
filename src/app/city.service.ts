import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { ICity,ICitiesColumnsOrder } from './model';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

@Injectable()
export class CityService {
  public BasicPath="http://10.138.77.141:8052/api/Sample/";
constructor(private _http:Http) { }

  public getCities():Observable<ICity[]> {
    return this._http.get(this.BasicPath+'Get').map((res:Response) => <ICity[]> res.json());
  } 
  public getCitiesColumnsOrder():Observable<ICitiesColumnsOrder[]> {
    return this._http.get(this.BasicPath+'GetColumnsOrder').map((res:Response) => <ICitiesColumnsOrder[]> res.json());
  }
  public PostColumnsOrder(IcityOrder:ICitiesColumnsOrder)
  {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(IcityOrder);
    return this._http.post(this.BasicPath+'Post', body, options )
    .map((response: Response) => < any > response.json()).catch(this.handleError);
  }
  public handleError(error: Response) {  
    console.error(error);  
    return Observable.throw(error.json().error || 'Server error');  
} 
}
