// import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';

// @Injectable()
// export class PurchaseService {

//     url: string
//     constructor(private http : Http){
//         this.url  = 'https://api.datamuse.com/words?ml='
//     }

//     search_word(term){
//         return this.http.get(this.url + term).map(res => {
//             return res.json().map(item => {
//                 return item.word
//             })
//         })
//     }
// }
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Items1,PurchaseOrderModel,PODetails,VendorList } from './purchaseordermodel';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';

@Injectable()
export class PurchaseService {
    public BasicPath="http://10.138.77.141:8011/api/PurchaseOrder/";
constructor(private _http:Http) { }
public getData():Observable<PurchaseOrderModel[]> {
    return this._http.get(this.BasicPath+'GetList').map((res:Response) => <PurchaseOrderModel[]> res.json()).catch(this.handleError);
  } 
  public getItemsData():Observable<Items1[]> {
    return this._http.get(this.BasicPath+'GetItemsList').map((res:Response) => <Items1[]> res.json()).catch(this.handleError);
  } 
  public getVendors():Observable<VendorList[]> {
    return this._http.get(this.BasicPath+'GetVendorList').map((res:Response) => <VendorList[]> res.json()).catch(this.handleError);
  } 
  public SearchData(code:string,name:string):Observable<PurchaseOrderModel[]> {
    return this._http.get(this.BasicPath+'GetData?'+'orderno='+code+'&vendor='+name).map((res:Response) => <PurchaseOrderModel[]> res.json()).catch(this.handleError);
  } 
  public Generate():Observable<string> {
    let headers = new Headers({ 'Content-Type': 'application/pdf' });
    let options = new RequestOptions({ headers: headers });
    return this._http.get(this.BasicPath+'GeneratePDF', options).map((res:Response) => <string> res.json()).catch(this.handleError);
  } 
  public PostData(_category:PurchaseOrderModel,files1)
  {
    let headers = new Headers({ 'Accept': 'application/json',
    'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(_category);    
    // options.body=body;
    //files1.append("value", JSON.stringify(_category));  
    return this._http.post(this.BasicPath+'Post', body, options )
    .map((response: Response) => < any > response.json()).catch(this.handleError);
  }
  public DeletePODetails(detailid:number)
  {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({podetailid:detailid});
    
    return this._http.post(this.BasicPath+'DeletePODetails', body, options )
    .map((response: Response) => < any > response.json()).catch(this.handleError);
  }
  public handleError(error: Response) {  
    console.error(error);  
    return Observable.throw(error.json().error || 'Server error');  
  }
}