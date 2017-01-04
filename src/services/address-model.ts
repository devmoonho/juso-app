export class AddressModel {
    url: string = 'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do';
    confmKey: string = 'U01TX0FVVEgyMDE2MTIzMDE5NTYyNjE3ODQ2';
    resultType: string = 'json';

    getQueryString(term: any, currentPage: any, countPerPage: any): any {
        let queryString = this.url
            + '?keyword=' + term
            + '&currentPage=' + currentPage
            + '&countPerPage=' + countPerPage
            + '&confmKey=' + this.confmKey
            + '&resultType=' + this.resultType
            + '&callback=JSONP_CALLBACK';
        return queryString;
    }
}

export class DaumModel {
    apiKey: string = '5bff0e5cded7a36b5b82c2905c11d951';
    localUrl: string = 'https://apis.daum.net';
    add2coord: string = '/local/geo/addr2coord';

    getQueryString(what: any, params: any): any {
        switch (what) {
            case 'add2coord':
                return this.localUrl + this.add2coord
                    + '?apiKey=' + this.apiKey
                    + '&q=' + params[0] + '&output=json'
                    + '&callback=JSONP_CALLBACK';
            default:
                break;
        }
    }
}