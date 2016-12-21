import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Keyboard, ScreenOrientation } from 'ionic-native';

import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = StartPage;
  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp(platform);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: StartPage },
      { title: 'Page Two', component: AboutPage }
    ];

  }

  initializeApp(platform: Platform) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      
      Keyboard.disableScroll(true); 

      if (platform.is('android') || platform.is('ios')){
        ScreenOrientation.lockOrientation('portrait');
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
