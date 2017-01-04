import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { AddressService } from '../../services/address';

@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html'
})

export class DetailPage implements OnInit {
    addressInfo: any;
    daumInfo: any = {};

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
                    this.daumInfo = res.channel.item[0];
                }
            })
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
