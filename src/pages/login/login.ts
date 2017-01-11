import { Component } from '@angular/core';
import { ModalController, Events, Platform, ViewController, NavController, LoadingController, ToastController} from 'ionic-angular';
import { AuthService } from '../../services/auth'
import { DatabaseService } from '../../services/database'
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LinkedinProvider } from '../../services/auth-provider'

import { HomePage } from '../home/home';

import firebase from 'firebase';

@Component({
  selector: 'page-login',
  providers: [AuthService, DatabaseService],
  templateUrl: 'login.html'
})

export class LoginPage {
  loginSwitch: string = "login";
  loader: any;
  linkedinProvider: LinkedinProvider = new LinkedinProvider();

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private authService: AuthService,
    private databaseService: DatabaseService,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {
  }

  successLogin() {
    let user = this.authService.getCurrentUser();
    this.displayToast('로그인 되었습니다.');
    this.navCtrl.setRoot(HomePage);
    this.events.publish('user:created', user, Date.now());
    // this.loader.dismiss();
  }

  failLogin() {
    this.displayToast('유효하지 않은 아이디 입니다.');
    // this.events.publish('user:created', null, Date.now());
    // this.loader.dismiss();
  }

  goGooglePlusAuth(): void {
    // this.displayLoading('로그인중...', 5000);

    this.authService.googlePlus()
      .then((userData) => {
        var credential = firebase.auth.GoogleAuthProvider.credential(userData.idToken);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.successLogin();
          })
          .catch((error) => {
            this.failLogin();
          })
      })
      .catch((error) => {
        this.failLogin();
      });
  }

  goFacebookAuth() {
    this.authService.facebook()
      .then((userData) => {
        var credential = firebase.auth.FacebookAuthProvider.credential(userData.authResponse.accessToken);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.successLogin();
          })
          .catch((error) => {
            this.failLogin();
          })
      })
      .catch((error) => {
        this.failLogin();
      })
  }

  goTwitterAuth() {
    this.authService.twitter()
      .then((userData) => {
        var credential = firebase.auth.TwitterAuthProvider.credential(userData.token, userData.secret);
        firebase.auth().signInWithCredential(credential)
          .then((result) => {
            this.successLogin();
          })
          .catch((error) => {
            this.failLogin();
          })
      })
      .catch((error) => {
        this.failLogin();
      })
  }

  goKakaoAuth() {

  }

  goGitHubAuth() {

  }

  goInstagramAuth() {
    this.authService.instagram()
      .then((userData) => {
        this.displayToast('로그인 되었습니다.');
      })
      .catch((error) => {
        this.displayToast('유효하지 않은 아이디 입니다.');
      })
  }

  goLinkedInAuth() {
    this.authService.linkedIn()
      .then((userData) => {
        this.authService.linkedinCustomToken(userData)
          .then((res) => {
            this.successLogin();
            this.storage.set(this.linkedinProvider.STORAGE_KEY, JSON.stringify(this.linkedinProvider.preference));
          })
          .catch((err) => {
            this.storage.remove(this.linkedinProvider.STORAGE_KEY);
            this.failLogin();
          })
      })
      .catch((error) => {
        this.storage.remove(this.linkedinProvider.STORAGE_KEY);
        this.failLogin();
      })
  }


  loginUser(email: string, password: string) {
    this.displayLoading('로그인중...', 5000);

    this.authService.loginUser(email, password)
      .then((res) => {
        this.successLogin();
        this.loader.dismiss();
        this.navCtrl.setRoot(HomePage);
      })
      .catch((error) => {
        this.failLogin();
        this.loader.dismiss();
        this.generateKorMessage(error.code);
      })
  }

  goSignup() {
    this.loginSwitch = 'signup';
  }

  goLogin() {
    this.loginSwitch = 'login';
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
    this.displayLoading('가입중...', 5000);
    this.authService.createUser(email, password)
      .then((res) => {
        let user = this.authService.getCurrentUser();
        this.databaseService.createUser(user.uid, name, email);
        user.updateProfile({
          displayName: name,
          photoURL: ""
        }).then((res) => {
          this.successLogin();
          this.navCtrl.setRoot(HomePage);
          this.loader.dismiss();
        }).catch((err) => {
          this.failLogin();
          this.generateKorMessage(err.code);
          this.loader.dismiss();
        })
      })
      .catch((error) => {
        this.failLogin();
        this.generateKorMessage(error.code);
        this.loader.dismiss();
      })
  }

  goResetPassword() {
    this.showPrompt();
    // var auth = firebase.auth();
    // var emailAddress = 

    // auth.sendPasswordResetEmail(emailAddress)
    //   .then((res) => {
    //     // Email sent.
    //   })
    //   .catch((err) => {
    //     // An error happened.
    //   });
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: '패스워드 재설정',
      message: "가입한 이메일을 적어 주세요",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: '취소',
          handler: data => {
          }
        },
        {
          text: '보내기',
          handler: data => {
            var auth = firebase.auth();
            var emailAddress = data.email;
            auth.sendPasswordResetEmail(emailAddress)
              .then((res) => {
                // Email sent.
                this.displayToast("이메일이 발송되었습니다.")
              })
              .catch((err) => {
                // An error happened.
              });
          }
        }
      ]
    });
    prompt.present();
  }

  dismiss() {
    this.loginSwitch = 'login';
  }

  displayToast(msg: string) {
    let toast: any;
    toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  displayLoading(msg: string, du: number) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      duration: du
    });
    this.loader.present();
  }

}
