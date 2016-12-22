import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth'
import firebase from 'firebase';

@Injectable()
export class DatabaseService {
    public USERS = '/users/';

    constructor(
        public authService: AuthService
    ) {
    }

    createUser(uid: string, name: string, email: string) {
        let user = firebase.database().ref(this.USERS + uid);
        user.set({
            username : name,
            email: email
        });
    }
}