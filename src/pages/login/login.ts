import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage{

  constructor(
   public viewCtrl: ViewController) {
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
