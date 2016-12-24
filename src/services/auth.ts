import { Injectable } from '@angular/core';
import { GooglePlus, Facebook } from 'ionic-native';
import { ToastController } from 'ionic-angular';

import firebase from 'firebase';

@Injectable()
export class AuthService {
    public fireAuth: any;

    constructor(
        public toastCtrl: ToastController) {
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

    googlePlus(): any {
        return GooglePlus.login({
            'webClientId': '19394399742-t0johi5e0kdd2o05d9oumfu91agnu4p8.apps.googleusercontent.com'
        });
    }

    facebook(): any {
        return Facebook.login(["public_profile", "email"]);
    }

    logout(): any {
        return this.fireAuth.signOut();
    }
}
