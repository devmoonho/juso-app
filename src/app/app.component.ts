import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, Keyboard } from 'ionic-native';

import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';

import { LoginRecord } from '../services/auth-provider'
import { Storage } from '@ionic/storage';

import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  userProfile: any;
  headingDisplayName: any = '익명 사용자';
  headingEmail: any;
  profileImage: any = 'assets/icon/icon.png';

  loginRecord: LoginRecord = new LoginRecord();
  pages: Array<{ title: string, component: any, segment: any }>;

  constructor(
    private platform: Platform,
    private events: Events,
    private storage: Storage
  ) {
    this.initializeApp(platform);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '주소 찾기', component: HomePage, segment: 'search' },
      { title: '즐겨 찾기', component: HomePage, segment: 'bookmark' },
      { title: '로그인', component: LoginPage, segment: 'login' }
    ];

    // Initialize Firebase
    firebase.initializeApp({
      apiKey: "AIzaSyAMNwt55ewLWJv3Ymzf8jwzhxQlSURJyWQ",
      authDomain: "juso-560bb.firebaseapp.com",
      databaseURL: "https://juso-560bb.firebaseio.com",
      storageBucket: "juso-560bb.appspot.com",
      messagingSenderId: "19394399742"
    });

    events.subscribe('user:created', (user, time) => {
      this.updateSideMenu(user);
    });

    events.subscribe('user:logout', () => {
      this.updateSideMenu(null);
    });
  }

  initializeApp(platform: Platform) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      Keyboard.disableScroll(true);

      if (platform.is('android') || platform.is('ios')) {
        // ScreenOrientation.lockOrientation('portrait');
      }

      this.storage.get(this.loginRecord.STORAGE_KEY)
        .then((result) => {
          if (result != null) {
            this.rootPage = HomePage;
            // reLogin
            let userInfo = JSON.parse(JSON.parse(result)['userInfo']);
            if (userInfo != null) {
              let accessToken = userInfo['stsTokenManager']['accessToken'];
              this.updateSideMenu(userInfo);
            }
          } else {
            this.rootPage = StartPage;
          }
        })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    switch (page.component) {
      case LoginPage:
        if (this.pages[2]['segment'] == 'login') {
          this.nav.push(page.component);
        } else {
          this.nav.push(StartPage);
          this.logout();
        }
      case HomePage:
        this.nav.getActive().instance.segment = page.segment;
        break;
      default:
        break;
    }
  }

  logout() {
    firebase.auth().signOut();
    this.storage.clear();
    this.updateSideMenu(null);
  }

  updateSideMenu(userProfile: any) {
    if (userProfile == null) {
      this.headingDisplayName = '익명 사용자';
      this.headingEmail = '';
      this.profileImage = 'assets/icon/icon.png';
      this.pages[2]['title'] = '로그인';
      this.pages[2]['segment'] = 'login';
    } else {
      this.setLoginInfo(userProfile);

      let provider;
      try {
        provider = userProfile;
      } catch (erro) {
        provider = userProfile.providerData[0];
      }
      this.headingDisplayName = provider['displayName'] == null ? '이름 공개되지 않음' : provider['displayName'];
      this.headingEmail = provider['email'] == null ? '이메일이 공개되지 않음' : provider['email'];
      this.profileImage = provider['photoURL'] == null ? 'assets/icon/icon.png' : userProfile['photoURL'];
      this.pages[2]['title'] = '로그 아웃';
      this.pages[2]['segment'] = 'logout';
    }
  }

  setLoginInfo(userInfo: any) {
    let loginRecord: any = {
      'userInfo': JSON.stringify(userInfo),
      'lastLogin': new Date()
    }
    this.storage.set(this.loginRecord.STORAGE_KEY, JSON.stringify(loginRecord));
  }
}