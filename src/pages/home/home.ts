import { Component, OnInit } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { ModalController, ToastController, Events } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { AboutPage } from '../about/about';
import { StartPage } from '../start/start';
import { DetailPage } from '../detail/detail';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { DatabaseService } from '../../services/database';
import { AddressService } from '../../services/address';

import { Storage } from '@ionic/storage';
import { LoginRecord} from '../../services/auth-provider'

@Component({
  selector: 'page-home',
  providers: [AuthService, AddressService],
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  searchTerm: any = '';
  userInfo: any;
  searchedAddressInfo: any;
  bookmarkAddressInfo: any = '';
  addressList: any;
  bookmarkList: any;
  searchIndex: number = 1;
  searchPerPage: number = 5;
  totalPage: any = 0;
  mainNotification: any;

  loginRecord: LoginRecord = new LoginRecord();

  STATUS: any = {
    'FIREST_LOAD': 'FIREST_LOAD',
    'NOT_EXIST_ITEMS': 'NOT_EXIST_ITEMS',
    'EXIST_ITEMS': 'EXIST_ITEMS'
  }

  prefixAddress: any = 'A';
  randomColor: any = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

  currentStatus: any = this.STATUS.FIREST_LOAD;
  bookmarkStatus: any = this.STATUS.NOT_EXIST_ITEMS;

  segment: any = 'search';

  debugInfo: any = '';

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private addressService: AddressService,
    private storage: Storage,
    private databaseService: DatabaseService,
    private events: Events,
    private toastCtrl: ToastController) {

    events.subscribe('bookmark:updated', (res, time) => {
      this.updateBookmark(res);
    });
  }

  ngOnInit() {
    this.userInfo = this.authService.getCurrentUser();
    let loginRecord: any = {
      'userInfo': this.userInfo,
      'lastLogin': new Date()
    }
    this.storage.set(this.loginRecord.STORAGE_KEY, JSON.stringify(loginRecord));
    this.initBookmark();
  }

  initBookmark() {
    this.debugInfo = JSON.stringify(this.userInfo);
    if (this.userInfo == null) {
      this.bookmarkList = [];
      this.bookmarkAddressInfo = '';
      this.bookmarkStatus = this.STATUS.NOT_EXIST_ITEMS;
    } else {
      this.events.publish('user:created', this.userInfo, Date.now());
      this.databaseService.getBookmark(this.userInfo.uid)
        .then((res) => {
          let children = [];
          res.forEach((childSnapshot) => {
            children.push(childSnapshot.val());
          })
          this.bookmarkList = children;
          this.bookmarkAddressInfo = res.numChildren();
          this.bookmarkStatus = this.STATUS.EXIST_ITEMS;
        })
    }
  }

  getRandomColor(index: number): string {
    // let idx = (index + this.searchIndex) % this.randomColor.length
    // return this.randomColor[index + ((this.searchIndex - 1) % this.randomColor.length)];
    let idx = (index) % this.randomColor.length
    return this.randomColor[idx];
  }

  searchJuso(): void {
    this.segment = 'search'
    this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
      .then((res) => {
        let totalItems = res.results.common.totalCount
        this.totalPage = Math.ceil(totalItems / this.searchPerPage);
        this.searchIndex = 1
        this.searchedAddressInfo = this.totalPage + ' / ' + this.searchIndex;

        this.addressList = res.results.juso;
        if (res.results.common.totalCount == 0) {
          this.bookmarkAddressInfo = '';
          this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
          this.mainNotification = '검색된 주소가 없습니다'
        } else {
          this.currentStatus = this.STATUS.EXIST_ITEMS;
          this.mainNotification = '끌어서 더보기';
        }
        Keyboard.close()
      })
      .catch((err) => {
        this.bookmarkAddressInfo = '';
        this.userInfo = JSON.stringify(err);
        this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
      })
  }

  openAbout(): void {
    let modal = this.modalCtrl.create(AboutPage);
    Keyboard.close();
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
      this.searchIndex >= this.totalPage ||
      this.segment != 'search'
    ) {
      refresher.complete();
      return;
    }

    setTimeout(() => {
      refresher.complete();
      this.addressService.searchAddress(this.searchTerm, this.searchIndex, this.searchPerPage)
        .then((res) => {
          let totalItems = res.results.common.totalCount
          this.searchIndex += 1;
          this.searchedAddressInfo = this.totalPage + ' / ' + this.searchIndex;
          this.addressList = this.addressList.concat(res.results.juso);
          this.currentStatus = this.STATUS.EXIST_ITEMS;
        })
        .catch((err) => {
          this.currentStatus = this.STATUS.NOT_EXIST_ITEMS;
        })
    }, 1000);
  }

  // detail(idx: number, segement: string): void {
  detail(idx: number): void {
    let modal;
    if (this.segment == 'search') {
      modal = this.modalCtrl.create(DetailPage, { "addressInfo": JSON.stringify(this.addressList[idx]), "segment":"search"});
    } else {
      modal = this.modalCtrl.create(DetailPage, { "addressInfo": JSON.stringify(this.bookmarkList[idx]), "segment": "bookmark" });
    }
    Keyboard.close()
    modal.present();
  }

  addBookmark(idx: number): void {
    if (this.userInfo != null) {
      this.databaseService.addBookmark(this.userInfo.uid, this.addressList[idx].bdMgtSn, this.addressList[idx])
        .then((res) => {
          return this.databaseService.getBookmark(this.userInfo.uid)
        })
        .then((res) => {
          this.updateBookmark(res);
        })
    } else {
      this.bookmarkList = [];
    }

  }

  trash(idx: number) {
    this.databaseService.removeBookmark(this.userInfo.uid, this.bookmarkList[idx].bdMgtSn)
      .then((res) => {
        return this.databaseService.getBookmark(this.userInfo.uid)
      })
      .then((res) => {
        this.updateBookmark(res);
      })
  }

  updateBookmark(res: any) {
    let children = [];
    res.forEach((childSnapshot) => {
      children.push(childSnapshot.val());
    })
    this.bookmarkStatus = this.STATUS.EXIST_ITEMS;
    this.bookmarkAddressInfo = res.numChildren();
    this.bookmarkList = children;
    this.segment = "bookmark";
  }
}
