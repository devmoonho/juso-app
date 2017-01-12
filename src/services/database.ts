import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth'
import firebase from 'firebase';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

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
               
                contents['index'] = moment().format('YYYYMMDDHHmmss');
                this.database.ref(this.USERS + uid + this.BOOKMARK + buildMgtNo)
                    .set(contents)
            })
    }

    removeBookmark(uid: string, buildMgtNo: string) {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).child(buildMgtNo).remove();
    }
}
