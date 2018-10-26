import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Category } from './categoriesmodel';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

@Injectable()
export class CategoryService {
    public BasicPath="http://10.138.77.141:8011/api/Categories/";
constructor(private _http:Http) { }
public getData():Observable<Category[]> {
    return this._http.get(this.BasicPath+'GetList').map((res:Response) => <Category[]> res.json());
  } 
  public SearchData(code:string,name:string):Observable<Category[]> {
    return this._http.get(this.BasicPath+'GetData?'+'code='+code+'&name='+name).map((res:Response) => <Category[]> res.json());
  } 
  public PostData(_category:Category)
  {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(_category);
    return this._http.post(this.BasicPath+'Post', body, options )
    .map((response: Response) => < any > response.json()).catch(this.handleError);
  }
  public handleError(error: Response) {  
    console.error(error);  
    return Observable.throw(error.json().error || 'Server error');  
  }
}