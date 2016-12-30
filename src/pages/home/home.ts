import { Component, OnInit } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { ModalController, ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { StartPage } from '../start/start';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { AddressService } from '../../services/address';

@Component({
  selector: 'page-home',
  providers: [AuthService, AddressService],
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  searchTerm: any;
  userInfo: any;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public addressService: AddressService,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.userInfo = JSON.stringify(this.authService.getCurrentUser());
  }

  searchJuso(): void {
    let user = this.authService.getCurrentUser();

    this.addressService.searchAddress(this.searchTerm, 1, 10)
      .then((res) => {
        this.userInfo = JSON.stringify(res);
      })
      .catch((err) => {

      })
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
