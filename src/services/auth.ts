import { Injectable } from '@angular/core';
import { GooglePlus, Facebook, TwitterConnect } from 'ionic-native';
import { LinkedIn, Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { ToastController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Storage } from '@ionic/storage';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import firebase from 'firebase';

import { LinkedinProvider, FirebaseToken } from './auth-provider'

@Injectable()
export class AuthService {
    public fireAuth: any;
    public oauth: OauthCordova = new OauthCordova();
    public linkedinProvider: LinkedinProvider = new LinkedinProvider();
    public firebaseToken: FirebaseToken = new FirebaseToken();

    constructor(
        public toastCtrl: ToastController,
        public http: Http,
        public storage: Storage
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
        var user = firebase.auth().currentUser;
        return user;
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

    directlyLinkedIn(customToken: any): any {
        // exist value 
        // 1. firebase login 
        // 2. go homePage
        // firebase sing up or login 
        return this.firebaseToken.singIn(customToken, firebase);
    }

    linkedIn(): any {
        let provider: LinkedIn = new LinkedIn({
            clientId: this.linkedinProvider.clientId,
            appScope: this.linkedinProvider.appScope,
            redirectUri: this.linkedinProvider.redirectUri,
            responseType: this.linkedinProvider.responseType,
            state: this.linkedinProvider.state
        });

        return this.oauth.logInVia(provider)
            .then((res) => {
                let queryAccessToken = this.linkedinProvider.getQueryString('access-token', res);
                this.linkedinProvider.preference['code'] = res['code'];
                return queryAccessToken;
            })
            .then((queryAccessToken) => {
                // get linkedin accessToken
                return this.http.post(queryAccessToken, '')
                    .map((res: Response) => {
                        this.linkedinProvider.preference['accessToken'] = res.json().access_token;
                        return this.linkedinProvider.getQueryString('user-profile', res);
                    })
                    .catch((error: any) => Observable.throw('accessToken error'))
                    .toPromise();
            })
            .then((queryUserProfile) => {
                // get linkedin user profile
                return this.http.get(queryUserProfile)
                    .map((res: Response) => {
                        this.linkedinProvider.setUserProfile(res.json())
                        let queryCustomToken = this.firebaseToken
                            .getQueryString('custom-token', this.linkedinProvider.getUserProfile());

                        this.linkedinProvider.preference['userProfile'] = this.linkedinProvider.getUserProfile();
                        return queryCustomToken;
                    })
                    .catch((error: any) => Observable.throw('linkedin user profile error'))
                    .toPromise();
            })
            .then((queryCustomToken) => {
                // get firebase accessToken 
                return this.http.get(queryCustomToken)
                    .map((res: Response) => {
                        return res;
                    })
                    .catch((error: any) => Observable.throw('custom token error'))
                    .toPromise();
            })
            .then((res) => {
                this.linkedinProvider.preference['customToken'] = res.json().token;
                // firebase sing up or login 
                return this.firebaseToken.singIn(res.json().token, firebase)
                    .then((result) => {
                        this.storage.set(this.linkedinProvider.STORAGE_KEY, JSON.stringify(this.linkedinProvider.preference));
                        return result;
                    })
                    .catch((error: any) => Observable.throw('singIn error'))
                    .toPromise();
            })
            .then((res) => {
                var user = firebase.auth().currentUser;
                return user.updateProfile({
                    displayName: this.linkedinProvider.getUserProfile()['name'],
                    photoURL: this.linkedinProvider.getUserProfile()['publicProfileUrl']
                })
                    .then((res) => {
                        return res;
                    })
                    .catch((error: any) => Observable.throw('updateProfile error'))
            })
            .then((res) => {
                var user = firebase.auth().currentUser;
                return user.updateEmail(this.linkedinProvider.getUserProfile().email)
                    .then((res) => {
                        return res;
                    })
                    .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
            })
            .catch((error) => {
                                 
                    .catch((error: any) => Observable.throw('updateEmail error'))
            })
            .catch((error: any) => Observable.throw('Server error'))
    }

    logout(): any {
        this.storage.clear();
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
