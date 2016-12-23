import { Injectable } from '@angular/core';

import firebase from 'firebase';

@Injectable()
export class AuthService {
    public fireAuth: any;

    constructor() {
        this.fireAuth = firebase.auth();
    }

    loginUser(email: string, password: string): any {
        return this.fireAuth.signInWithEmailAndPassword(email, password);
    }

    createUser(email: string, password: string): any {
        return this.fireAuth.createUserWithEmailAndPassword(email, password);
    }

    getCurrentUser(): any {
        return this.fireAuth.currentUser;
    }

    googlePlus(): any{
        var provider = new firebase.auth.GoogleAuthProvider();
        return this.fireAuth.signInWithPopup(provider);

        // return this.fireAuth.getRedirectResult();
    }

    logout(): any{
        return this.fireAuth.signOut();
    }
}