import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth'
import firebase from 'firebase';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class DatabaseService {
    database: any = firebase.database();
    USERS: any = '/users/';
    BOOKMARK: any = '/bookmark/';

    constructor(
        public authService: AuthService
    ) {
    }

    createUser(uid: string, name: string, email: string) {
        let user = this.database.ref(this.USERS + uid);
        user.set({
            username: name,
            email: email
        });
    }

    listenerBookmark(uid: string, events: any): any {
        this.database.ref(this.USERS + uid + this.BOOKMARK).on('value', function (res) {
            events.publish('bookmark:updated', res, Date.now());
        });
    }

    getBookmark(uid: string): any {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).once('value');
    }

    addBookmark(uid: string, buildMgtNo: string, contents: any): any {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).once('value')
            .then((res) => {
                // let today = new Date();
                // let date = today.toString().replace( /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, '$4:$5:$6 $2/$3/$1' );
                contents['index'] = this.makeIndex();
                this.database.ref(this.USERS + uid + this.BOOKMARK + buildMgtNo)
                    .set(contents)
            })
    }

    removeBookmark(uid: string, buildMgtNo: string) {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).child(buildMgtNo).remove();
    }

    makeIndex(): any {
        let index;
        let today = new Date();
        let yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // getMonth() is zero-based
        let dd = today.getDate();
        return String(10000 * yyyy + 100 * mm + dd + this.time_format(today)); // Leading zeros for mm and dd
    }

    time_format(d) {
        let hours = this.format_two_digits(d.getHours());
        let minutes = this.format_two_digits(d.getMinutes());
        let seconds = this.format_two_digits(d.getSeconds());
        return hours + minutes + seconds;
    }

    format_two_digits(n) {
        return n < 10 ? '0' + n : n;
    }
}
