import { Component, OnInit } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { ModalController, ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { StartPage } from '../start/start';
import { DetailPage } from '../detail/detail';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { AddressService } from '../../services/address';

@Component({
  selector: 'page-home',
  providers: [AuthService, AddressService],
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  searchTerm: any = '';
  userInfo: any;
  searchedAddressInfo: any;
  bookmarkAddressInfo: any;
  addressList: any;
  searchIndex: number = 1;
  searchPerPage: number = 5;
  totalPage: any = 0;
  mainNotification: any;

  STATUS: any = {
    'FIREST_LOAD': 'FIREST_LOAD',
    'NOT_EXIST_ITEMS': 'NOT_EXIST_ITEMS',
    'EXIST_ITEMS': 'EXIST_ITEMS'
  }

  prefixAddress: any = 'A';
  randomColor: any = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
    '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

  currentStatus: any = this.STATUS.FIREST_LOAD;

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public addressService: AddressService,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    // this.userInfo = JSON.stringify(this.authService.getCurrentUser());
    // TODO for Debug
    // this.searchTerm = '삼성동';
    // this.searchJuso();
    this.userInfo = this.authService.getCurrentUser();
    this.getBookmark();
  }

  getBookmark(){
    this.bookmarkAddressInfo = '0'     
  }

  getRandomColor(index: number): string {
    let idx = (index + this.searchIndex) % this.randomColor.length

    // return this.randomColor[index + ((this.searchIndex - 1) % this.randomColor.length)];
    return this.randomColor[idx];
  }
  
  searchJuso(): void {
    this.searchIndex = 1
    this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
      .then((res) => {

        let totalItems = res.results.common.totalCount
        this.totalPage = Math.ceil(totalItems / this.searchPerPage);

        this.searchedAddressInfo = this.totalPage + ' / ' + this.searchIndex;

        this.addressList = res.results.juso;
        if (res.results.common.totalCount == 0) {
          this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
          this.mainNotification = '검색된 주소가 없습니다' 
        } else {
          this.currentStatus = this.STATUS.EXIST_ITEMS;
          this.mainNotification = '끌어서 더보기';
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
      this.currentStatus == this.STATUS.NOT_EXIST_ITEMS ||
      this.searchIndex >= this.totalPage
    ) {
      refresher.complete();
      return;
    }

    this.searchIndex += 1;
    this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
      .then((res) => {

        let totalItems = res.results.common.totalCount
        this.searchedAddressInfo = this.totalPage + ' / ' + this.searchIndex;
        this.addressList = res.results.juso.concat(this.addressList);
        this.currentStatus = this.STATUS.EXIST_ITEMS;
        refresher.complete();
      })
      .catch((err) => {
        this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
        refresher.complete();
      })
  }

  detail(idx: number): void {
    let modal = this.modalCtrl.create(DetailPage, {"addressInfo": JSON.stringify(this.addressList[idx])});
    Keyboard.close()
    modal.present();
  }
}
