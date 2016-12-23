import { Component } from '@angular/core';
import { ModalController, Platform, ViewController, NavController, LoadingController} from 'ionic-angular';
import { AuthService } from '../../services/auth'
import { DatabaseService } from '../../services/database'
import { AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  providers: [AuthService, DatabaseService],
  templateUrl: 'login.html'
})

export class LoginPage {
  loginSwitch: string = "login";

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public authService: AuthService,
    public databaseService: DatabaseService,
    public alertCtrl: AlertController
  ) {
  }

  loginUser(email: string, password: string) {
    this.displayLoading('로그인중...', 3000);

    this.authService.loginUser(email, password)
      .then((res) => {
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error) => {
        console.log(error);
        this.generateKorMessage(error.code);
      })
  }

  generateKorMessage(ret: any) {

    switch (ret) {
      case undefined:
        this.navCtrl.setRoot(HomePage);
        break;
      case 'auth/invalid-email':
        this.showLoginAlert("유효한 이메일이 아닙니다.");
        break;
      case 'auth/user-disabled':
        this.showLoginAlert("제한된 사용자 입니다.");
        break;
      case 'auth/user-not-found':
        this.showLoginAlert("사용자를 찾을 수 없습니다.");
        break;
      case 'auth/wrong-password':
        this.showLoginAlert("유효하지 않은 패스워드입니다.");
        break;
      case 'auth/weak-password':
        this.showLoginAlert("패스워드는 적어도 6자리 이상이여야 합니다.");
        break;
      default:
        this.showLoginAlert("시스템 점검으로 로그인 할 수 없습니다.\n" + ret);
        break;
    }
  }

  showLoginAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: '로그인 에러!',
      subTitle: message,
      buttons: ['확인']
    });
    alert.present();
  }

  signup(name: string, email: string, password: string) {

    this.authService.createUser(email, password)
      .then((res) => {
        let user = this.authService.getCurrentUser();
        this.databaseService.createUser(user.uid, name, email);

        this.navCtrl.setRoot(HomePage);
      })
      .catch((error) => {
        console.log(error);
        this.generateKorMessage(error.code);
      })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  displayLoading(msg: string, du: number) {
    let loader = this.loadingCtrl.create({
      content: msg,
      duration: du
    });
    loader.present();
  }
}
