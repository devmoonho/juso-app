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
    linkedin: 'https://kr.linkedin.com/in/moonho-yeo-8b53b9117',
    // about: '도로명주소 검색기능을 모바일에서 구현한 App이며 Firebase와 연동하여 사용자 관리및 즐겨찾기 구현 '
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

  goLinkedin() {
    this.displayToast("클립보드에 저장되었습니다.");
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
