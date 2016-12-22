import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ModalController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  isAndroid = false;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  goHomePage(): void {
    this.navCtrl.setRoot(HomePage);
  }

  goLoginPage(): void {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present()
  }

}