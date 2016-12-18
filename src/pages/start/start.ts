import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  isAndroid = false;
  constructor(
    public navCtrl: NavController,
    public platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  goHomePage(): void {
    this.navCtrl.setRoot(HomePage);
  }

}