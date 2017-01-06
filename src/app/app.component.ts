import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
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
  heading: any;

  loginRecord: LoginRecord = new LoginRecord();
  pages: Array<{ title: string, component: any, segment: any }>;

  constructor(
    public platform: Platform,
    private storage: Storage
  ) {
    this.initializeApp(platform);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '주소 찾기', component: HomePage, segment: 'search' },
      { title: '즐겨 찾기', component: HomePage, segment: 'bookmark' },
      { title: '로그인', component: HomePage, segment: 'login' }
    ];

    // Initialize Firebase
    firebase.initializeApp({
      apiKey: "AIzaSyAMNwt55ewLWJv3Ymzf8jwzhxQlSURJyWQ",
      authDomain: "juso-560bb.firebaseapp.com",
      databaseURL: "https://juso-560bb.firebaseio.com",
      storageBucket: "juso-560bb.appspot.com",
      messagingSenderId: "19394399742"
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
            this.userProfile = firebase.auth().currentUser;
            if(this.userProfile == null){
                this.heading = '익명 사용자';
                this.pages[2]['title'] = '로그인';
            }else{
                this.heading = this.userProfile;
                this.pages[2]['title'] = '로그 아웃';
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
    if (page.component != HomePage) {
      this.nav.push(page.component);
    } else {
      this.nav.getActive().instance.segment = page.segment;
    }
  }
}
