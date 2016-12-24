import { Component, OnInit } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { ModalController, ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { StartPage } from '../start/start';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth'

@Component({
  selector: 'page-home',
  providers: [AuthService],
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  searchTerm: any;
  userInfo: any;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public toastCtrl: ToastController) {
  }

  ngOnInit(){
    this.userInfo = JSON.stringify(this.authService.getCurrentUser());
  }

  searchJuso(term: any): void {
    let user = this.authService.getCurrentUser();
    let toast: any;

    if (user) {
      toast = this.toastCtrl.create({
        message: 'User was added successfully\n' + term + '\n' + user.email,
        duration: 3000
      });
    } else {
      toast = this.toastCtrl.create({
        message: 'User was added successfully\n' + term + '\n',
        duration: 3000
      });
    }
    toast.present()
  }

  openAbout(): void {
    let modal = this.modalCtrl.create(AboutPage);
    Keyboard.close()
    modal.present();
  }

  logout(): void {
    this.authService.logout()
      .then((result) => {
        this.navCtrl.setRoot(StartPage); 
      })
      .catch((error) => {

      })
  }
}
