import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Items,CategoryList } from './itemsmodel';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

@Injectable()
export class ItemsService {
    public BasicPath="http://10.138.77.141:8011/api/Items/";
constructor(private _http:Http) { }
public getData():Observable<Items[]> {
    return this._http.get(this.BasicPath+'GetList').map((res:Response) => <Items[]> res.json());
  } 
  public getCategories():Observable<CategoryList[]> {
    return this._http.get(this.BasicPath+'GetCategoriesList').map((res:Response) => <CategoryList[]> res.json());
  } 
  public SearchData(code:string,name:string,category:string):Observable<Items[]> {
    return this._http.get(this.BasicPath+'GetData?'+'code='+code+'&name='+name+'&category='+category).map((res:Response) => <Items[]> res.json());
  } 
  public Generate():Observable<string> {
    let headers = new Headers({ 'Content-Type':'application/pdf' });
    let options = new RequestOptions({ headers: headers });
    return this._http.get(this.BasicPath+'GeneratePDF', options).map((res:Response) => <string> res.json());
  } 
  public PostData(_category:Items)
  {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(_category);
    
    return this._http.post(this.BasicPath+'Post', body, options )
    .map((response: Response) => < any > response.json()).catch(this.handleError);
  }
  public handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');  
  }
}