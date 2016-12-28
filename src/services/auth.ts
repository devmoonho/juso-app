import { Injectable } from '@angular/core';
import { GooglePlus, Facebook, TwitterConnect } from 'ionic-native';
import { LinkedIn, Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { ToastController } from 'ionic-angular';

import { Http } from '@angular/http';

import firebase from 'firebase';

import { LinkedinProvider, FirebaseToken } from './auth-provider'

declare var window: any;

@Injectable()
export class AuthService {
    public fireAuth: any;
    private oauth: OauthCordova = new OauthCordova();

    constructor(
        public toastCtrl: ToastController,
        public http: Http,
        public linkedinProvider: LinkedinProvider,
        public firebaseToken: FirebaseToken
    ) {
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
            clientId: this.linkedinProvider.clientId,
            appScope: this.linkedinProvider.appScope,
            redirectUri: this.linkedinProvider.redirectUri,
            responseType: this.linkedinProvider.responseType,
            state: this.linkedinProvider.state
        });

        this.oauth.logInVia(provider)
            .then((res) => {
                let queryAccessToken = this.linkedinProvider.getQueryString('access-token', res);
                // get linkedin accessToken
                this.http.post(queryAccessToken, '')
                    .subscribe(res => {
                        let queryUserProfile = this.linkedinProvider.getQueryString('user-profile', res);
                        // get linkedin user profile
                        this.http.get(queryUserProfile)
                            .subscribe(res => {
                                this.linkedinProvider.setUserProfile(res);
                                // get firebase accessToken 
                                let queryCustomToken = this.firebaseToken
                                    .getQueryString('custom-token', this.linkedinProvider.getUserProfile);
                                this.http.get(queryCustomToken)
                                    .subscribe(res => {
                                        // firebase sing up or login 
                                        this.firebaseToken.singIn(res, firebase, this.linkedinProvider.getUserProfile);
                                        return 
                                    }, (err) => {

                                    })
                            }, (err) => {

                            })
                    }, (err) => {

                    })
            })
            .catch((error) => {

            })
    }

    logout(): any {
        return this.fireAuth.signOut();
    }

    displayToast(msg: string) {
        let toast: any;
        toast = this.toastCtrl.create({
            message: msg,
            duration: 5000
        });
        toast.present();
    }
}
