import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ModalController, ToastController, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';

import firebase from 'firebase';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  loader: any;
  isAndroid = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public databaseService: DatabaseService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  goHomePage(): void {
    this.navCtrl.setRoot(HomePage);
  }

  goLoginPage(): void {
    this.navCtrl.push(LoginPage);
  }

  goGooglePlusAuth(): void {
    this.displayLoading('로그인중...', 5000);

    this.authService.googlePlus()
      .then((userData) => {
        var credential = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.loader.dismiss();
            this.displayToast('로그인 되었습니다.');
            this.navCtrl.setRoot(HomePage);
          })
          .catch((error) => {
            this.loader.dismiss();
            this.displayToast('유효하지 않은 아이디 입니다.');
          })
      })
      .catch((error) => {
        this.loader.dismiss();
        this.displayToast('유효하지 않은 아이디 입니다.');
      });
  }

  goFacebookAuth() {
    this.authService.facebook()
      .then((userData) => {
        var credential = firebase.auth.FacebookAuthProvider.credential(userData.authResponse.accessToken);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.displayToast('로그인 되었습니다.');
            this.navCtrl.setRoot(HomePage);
          })
          .catch((error) => {
            this.displayToast('유효하지 않은 아이디 입니다.');
          })
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다.');
      })
  }

  goTwitterAuth() {
    this.authService.twitter()
      .then((userData) => {
        var credential = firebase.auth.TwitterAuthProvider.credential(userData.token, userData.secret);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.displayToast('로그인 되었습니다.');
            this.navCtrl.setRoot(HomePage);
          })
          .catch((error) => {
            this.displayToast('유효하지 않은 아이디 입니다.' + JSON.stringify(error));
          })
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다.' + JSON.stringify(error));
      })
  }

  goGitHubAuth() {
    
  }

  goInstagramAuth() {
    this.authService.instagram()
      .then((userData) => {
        this.displayToast('로그인 되었습니다.' + JSON.stringify(userData));
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다.' + JSON.stringify(error));
      })
  }

  goLinkedInAuth() {
    this.authService.linkedIn()
      .then((userData) => {
        // var uid = "some-uid";
        // var customToken = firebase.auth().createCustomToken(uid);
        // this.displayToast('Token.' + customToken + '\n user : ' + JSON.stringify(userData));
        // firebase.auth().signInWithCustomToken(customToken)
        //   .then((result) => {
        this.displayToast('로그인 되었습니다.\n' + JSON.stringify(userData));
        //   })
        //   .catch((error) => {
        //     this.displayToast('Token.' + customToken + '\n user : ' + JSON.stringify(userData));
        //   })
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다.' + JSON.stringify(error));
      })
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
        this.displayToast('로그아웃 중 알 수 없는 에러 \n' + JSON.stringify(error));
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
