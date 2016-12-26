import { Injectable } from '@angular/core';
import { GooglePlus, Facebook, TwitterConnect } from 'ionic-native';
import { LinkedIn, Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { ToastController } from 'ionic-angular';

import firebase from 'firebase';

declare var window: any;

@Injectable()
export class AuthService {
    public fireAuth: any;
    private oauth: OauthCordova = new OauthCordova();

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

    twitter(): any {
        return TwitterConnect.login();
    }

    github(): any {

    }

    instagram(): any {
        let provider: Instagram = new Instagram({
            clientId: "83595a9052d9437c86b807f1220cd8cb",
            appScope: ["basic"],
            redirectUri: "http://localhost/callback",
            responseType: "code"
        });

        return this.oauth.logInVia(provider);
    }

    linkedIn(): any {
        let provider: LinkedIn = new LinkedIn({
            clientId: "81alo9i368lt7t",
            appScope: ["r_basicprofile", "r_emailaddress"],
            redirectUri: "http://localhost/callback",
            responseType: "code",
            state: "987654321"
        });

        return this.oauth.logInVia(provider);
    }

    logout(): any {
        return this.fireAuth.signOut();
    }

    displayToast(msg: string) {
        let toast: any;
        toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }
}
