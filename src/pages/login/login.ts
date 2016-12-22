import { Component } from '@angular/core';
import { ModalController, Platform, ViewController, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth'
import { AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  providers: [AuthService],
  templateUrl: 'login.html'
})

export class LoginPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public authService: AuthService,
    public alertCtrl: AlertController
  ) {
  }

  loginUser(email: string, password: string) {
    this.authService.loginUser(email, password)
      .then((res)=> {
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error) => {
        console.log(error);
        this.generateKorMessage(error.code);
      })
  }

  generateKorMessage(ret: any) {
    switch (ret) {
      case 'auth/invalid-email':
        this.showAlert("유효한 이메일이 아닙니다.");
        break;
      case 'auth/user-disabled':
        this.showAlert("제한된 사용자 입니다.");
        break;
      case 'auth/user-not-found':
        this.showAlert("사용자를 찾을 수 없습니다.");
        break;
      case 'auth/wrong-password':
        this.showAlert("유효하지 않은 패스워드입니다.");
        break;
      default:
        this.showAlert("시스템 점검으로 로그인 할 수 없습니다.");
        break;
    }
  }

  showAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: '로그인 에러!',
      subTitle: message,
      buttons: ['확인']
    });
    alert.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
