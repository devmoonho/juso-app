import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ModalController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database'

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
      .then((result) => {
        console.log(result);
        this.goHomePage();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveUserInfo(result: any){
    let uid  = result.user.uid;
    let email = result.user.email;
    let name = result.user.displayName;
    this.databaseService.createUser(uid, name, email);
  }

  logout(): void {
    this.authService.logout()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    })
  }
}