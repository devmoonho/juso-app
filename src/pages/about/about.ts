import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {

  admin: any = {
    tel: '+82-10-9968-8303',
    email: 'yeomoonho@gmail.com',
    linkedin: 'kr.linkedin.com/in/yeomoonho',
    facebook: 'facebook.com/yeomoonho',
    about: 'Ionic2 & Firebase3 & Angular2'
  }

  constructor(
    public viewCtrl: ViewController,
    private toastCtrl: ToastController
  ) {

  }

  goEmail(){

  }
  
  goCall(){

  }

  goFacebook(){
    
  }
  goLinkedin() {
    // this.displayToast("클립보드에 저장되었습니다.");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  displayToast(msg: string) {
    let toast: any;
    toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
