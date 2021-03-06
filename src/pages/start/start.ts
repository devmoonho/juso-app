import { NavController, Events } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ModalController, ToastController, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import { Http, Response } from '@angular/http';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

import { LinkedinProvider, FirebaseToken } from '../../services/auth-provider'

import firebase from 'firebase';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage implements OnInit {
  loader: any;
  isAndroid = false;
  userInfo: any;

  linkedinProvider: LinkedinProvider = new LinkedinProvider();
  firebaseToken: FirebaseToken = new FirebaseToken();

  constructor(
    private navCtrl: NavController,
    private http: Http,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private events: Events,
    private platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  ngOnInit() {

  }

  goHomePage(): void {
    this.navCtrl.setRoot(HomePage);
  }

  goLoginPage(): void {
    this.navCtrl.push(LoginPage);
  }

  successLogin() {
    let user = this.authService.getCurrentUser();
    this.displayToast('로그인 되었습니다.');
    this.navCtrl.setRoot(HomePage);
    this.events.publish('user:created', user, Date.now());
    // this.loader.dismiss();
  }

  failLogin() {
    this.displayToast('유효하지 않은 아이디 입니다.');
    this.events.publish('user:created', null, Date.now());
    // this.loader.dismiss();
  }

  goGooglePlusAuth(): void {
    // this.displayLoading('로그인중...', 5000);

    this.authService.googlePlus()
      .then((userData) => {
        var credential = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.successLogin();
          })
          .catch((error) => {
            this.failLogin();
          })
      })
      .catch((error) => {
        this.failLogin();
      });
  }

  goFacebookAuth() {
    this.authService.facebook()
      .then((userData) => {
        var credential = firebase.auth.FacebookAuthProvider.credential(userData.authResponse.accessToken);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.successLogin();
          })
          .catch((error) => {
            this.failLogin();
          })
      })
      .catch((error) => {
        this.failLogin();
      })
  }

  goTwitterAuth() {
    this.authService.twitter()
      .then((userData) => {
        var credential = firebase.auth.TwitterAuthProvider.credential(userData.token, userData.secret);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.successLogin();
          })
          .catch((error) => {
            this.failLogin();
          })
      })
      .catch((error) => {
        this.failLogin();
      })
  }

  goGitHubAuth() {

  }

  goInstagramAuth() {
    this.authService.instagram()
      .then((userData) => {
        this.displayToast('로그인 되었습니다.');
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다.');
      })
  }

  goLinkedInAuth() {
    this.authService.linkedIn()
      .then((userData) => {
        this.authService.linkedinCustomToken(userData)
          .then((res) => {
            this.successLogin();
            this.storage.set(this.linkedinProvider.STORAGE_KEY, JSON.stringify(this.linkedinProvider.preference));
          })
          .catch((err) => {
            this.storage.remove(this.linkedinProvider.STORAGE_KEY);
            this.failLogin();
          })
      })
      .catch((error) => {
        this.storage.remove(this.linkedinProvider.STORAGE_KEY);
        this.failLogin();
      })
  }

  showPreference() {
    this.storage.get(this.linkedinProvider.STORAGE_KEY)
      .then((result) => {
        this.userInfo = JSON.parse(result).customToken;
      });
  }

  saveUserInfo(result: any) {
    let uid = result.user.uid;
    let email = result.user.email;
    let name = result.user.displayName;
    this.databaseService.createUser(uid, name, email);
  }

  logout(): void {
    this.authService.logout()
      .then((result) => {
        this.displayToast('로그아웃 되었습니다.');
      })
      .catch((error) => {
        this.displayToast('로그아웃 중 알 수 없는 에러 \n');
      })
  }

  displayToast(msg: string) {
    let toast: any;
    toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }

  displayLoading(msg: string, du: number) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      duration: du
    });
    this.loader.present();
  }

}
