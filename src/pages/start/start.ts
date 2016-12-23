import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ModalController, ToastController } from 'ionic-angular';

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

  isAndroid = false;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public databaseService: DatabaseService,
    public toastCtrl: ToastController,
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
    this.authService.googlePlus()
      .then((userData) => {
        var provider = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
        firebase.auth().signInWithCredential(provider)
          .then((result) => {
            this.displayToast(result.email + ' 계정으로 로그인 되었습니다.');
            this.navCtrl.setRoot(HomePage);
          })
          .catch((error) => {
            this.displayToast('유효하지 않은 아이디 입니다. \n' + JSON.stringify(error.message));
          })
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다. \n' + JSON.stringify(error.message));
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
        this.displayToast('로그아웃 중 알 수 없는 에러 \n' + JSON.stringify(error));
      })
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