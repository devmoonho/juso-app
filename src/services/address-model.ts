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
