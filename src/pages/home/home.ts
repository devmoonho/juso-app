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
  searchedAddressInfo: any;
  bookmarkAddressInfo: any;
  addressList: any;
  searchIndex: number = 1;
  searchPerPage: number = 5;

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
    this.searchIndex = 1 
    this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
      .then((res) => {
        this.userInfo = JSON.stringify(res);
        this.searchedAddressInfo = '찾은 주소 ' + JSON.stringify(res.results.common.totalCount);
        this.bookmarkAddressInfo = '즐겨찾기 ';
        this.addressList = res.results.juso;
        Keyboard.close()
      })
      .catch((err) => {
        this.userInfo = JSON.stringify(err);
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.searchIndex += 1;
    this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
      .then((res) => {
        this.addressList = res.results.juso.concat(this.addressList);
        refresher.complete();
      })
      .catch((err) => {

        refresher.complete();
      })

    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   this.userInfo = 'Async operation has ended';
    //   refresher.complete();
    // }, 2000);
  }
}
