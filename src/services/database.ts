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

    addBookmark(uid: string, buildMangementNo: string, contents: any) {
        this.database.ref(this.USERS + uid + this.BOOKMARK + buildMangementNo)
            .set(contents)
    }

    removeBookmark(uid: string, buildMangementNo: string) {
        this.database.ref.child(this.USERS + uid + this.BOOKMARK + buildMangementNo).remove();
    }

}
