import { Injectable } from '@angular/core';
import { Http, Jsonp, Response, Headers, RequestOptions } from '@angular/http';

import { AddressModel } from './address-model'
import { Observable } from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AddressService {
    addressModel: AddressModel = new AddressModel();

    constructor(
        public http: Http,
        public jsonp: Jsonp 
    ) { }

    searchAddress(term: any, currPage: any, perPage: any) {
        // 특수문자 제거
        let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\_+<>@\#$%&\\\=\(\'\"]/gi
        let queryString = this.addressModel.getQueryString(term.replace(regExp, ''), currPage, perPage);
        let headers = new Headers({ 'Content-Type': 'application/xml' });
        let options = new RequestOptions({ headers: headers });
        
        return this.jsonp
            .get(encodeURI(queryString), options)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
            .toPromise();
   }
}