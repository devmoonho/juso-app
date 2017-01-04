import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { AddressService } from '../../services/address';

@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html'
})

export class DetailPage implements OnInit {
    addressInfo: any;

    constructor(
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private addressService: AddressService
    ) {
    }

    ngOnInit() {
        this.addressInfo = JSON.parse(this.navParams.get("addressInfo"));
        this.addressService.getAddress2Coord(this.addressInfo.jibunAddr)
            .then((res) => {
                if (res.channel.item.length != 0) {
                    this.addressInfo['daum'] = res.channel.item[0];
                    this.addressInfo = JSON.stringify(this.addressInfo);
                }
            })
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
