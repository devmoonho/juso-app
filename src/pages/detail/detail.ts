import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, Platform, NavParams, ViewController } from 'ionic-angular';
import { AddressService } from '../../services/address';
import { Clipboard } from 'ionic-native';

@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html'
})

export class DetailPage implements OnInit {
    addressInfo: any;
    daumInfo: any = {};

    checkZipNo: any = false;
    checkRoadAddr: any = false;
    checkEngAddr: any = false;
    checkLocal: any = false;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private toastCtrl: ToastController,
        private addressService: AddressService
    ) {
    }

    ngOnInit() {
        this.addressInfo = JSON.parse(this.navParams.get("addressInfo"));
        this.addressService.getAddress2Coord(this.addressInfo.jibunAddr)
            .then((res) => {
                if (res.channel.item.length != 0) {
                    this.daumInfo = res.channel.item[0];
                }
            })
    }

    clipboard() {
        let copyString =
            '지번명 : ' + this.addressInfo.jibunAddr 
            + (this.checkZipNo==true?' [우편번호] : ' + this.addressInfo.zipNo : '')
            + (this.checkRoadAddr==true? ' [도로명] : ' + this.addressInfo.roadAddrPart1: '')
            + (this.checkEngAddr==true? ' [영문명] : ' + this.addressInfo.engAddr: '')
            + (this.checkLocal==true? ' [위도] : ' + this.daumInfo.lat + ' [경도] : ' + this.daumInfo.lng : '')

        Clipboard.copy(copyString);
        this.displayToast('클립보드에 복사되었습니다.')
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    displayToast(msg: string) {
        let toast: any;
        toast = this.toastCtrl.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }
}
