import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {

  constructor(
   public viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
