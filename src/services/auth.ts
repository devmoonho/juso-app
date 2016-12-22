import { Injectable } from '@angular/core';

import firebase from 'firebase';

@Injectable()
export class AuthService {
    public fireAuth: any;
    public userProfile: any;

    constructor() {
        this.fireAuth = firebase.auth();
        this.userProfile = firebase.database().ref('/userProfile');
    }

    loginUser(email: string, password: string): any {
        return this.fireAuth.signInWithEmailAndPassword(email, password);
    }

    createUser(email: string, password: string):any {
        return this.fireAuth.createUserWithEmailAndPassword(email, password);
    }

    getCurrentUser():any{
        return this.fireAuth.currentUser;
    }
}