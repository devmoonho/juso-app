import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { JsonpModule } from '@angular/http';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { StartPage } from '../pages/start/start';
import { LoginPage } from '../pages/login/login';

import { AuthService } from '../services/auth';
import { DatabaseService } from '../services/database';
import { AddressService } from '../services/address';
import { Storage } from '@ionic/storage';

import { SubStringPipe } from '../pipe/common.pipe';

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    SubStringPipe,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService, 
    DatabaseService, 
    Storage, 
    AddressService]
})
export class AppModule { }
