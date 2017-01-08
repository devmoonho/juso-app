import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth'
import firebase from 'firebase';

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

    getBookmark(uid: string): any {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).once('value');
    }

    addBookmark(uid: string, buildMgtNo: string, contents: any): any {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).once('value')
        .then((res) => {
           contents['index'] = res.numChildren()
            this.database.ref(this.USERS + uid + this.BOOKMARK + buildMgtNo)
            .set(contents)
        })
   }

    removeBookmark(uid: string, buildMgtNo: string) {
        return this.database.ref(this.USERS + uid + this.BOOKMARK).child(buildMgtNo).remove();
    }

}
