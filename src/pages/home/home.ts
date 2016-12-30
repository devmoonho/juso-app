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

  STATUS: any = {
    'FIREST_LOAD': 'FIREST_LOAD',
    'NOT_EXIST_ITEMS': 'NOT_EXIST_ITEMS',
    'EXIST_ITEMS': 'EXIST_ITEMS'
  }

  currentStatus: any = this.STATUS.FIREST_LOAD;

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
        this.searchedAddressInfo = '찾은 주소 ' + res.results.common.totalCount;
        this.bookmarkAddressInfo = '즐겨찾기 ';
        this.addressList = res.results.juso;
        if (res.results.common.totalCount == 0) {
          this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
        } else {
          this.currentStatus = this.STATUS.EXIST_ITEMS;
        }
        Keyboard.close()
      })
      .catch((err) => {
        this.userInfo = JSON.stringify(err);
        this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
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
    if (this.currentStatus == this.STATUS.FIREST_LOAD ||
      this.currentStatus == this.STATUS.NOT_EXIST_ITEMS) {
      refresher.complete();
      return;
    }

    this.searchIndex += 1;
    this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
      .then((res) => {
        this.addressList = res.results.juso.concat(this.addressList);
        this.currentStatus = this.STATUS.EXIST_ITEMS;
        refresher.complete();
      })
      .catch((err) => {
        this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
        refresher.complete();
      })
  }
}
