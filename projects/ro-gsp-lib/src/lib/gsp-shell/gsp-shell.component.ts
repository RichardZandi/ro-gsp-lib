import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash';
import {RogspLibService} from '../ro-gsp-lib.service';
import {GSP, GSPDeviceRedeem, GSPRedeem, GSPReward} from 'ro-lib-lib';
import {AngularFireDatabase} from 'angularfire2/database';


@Component({
    selector: 'capp-gsp-shell',
    templateUrl: './gsp-shell.component.html',
    styleUrls: ['./gsp-shell.component.css'],
    encapsulation: ViewEncapsulation.None

})
export class GspShellComponent implements OnInit, OnDestroy {
    @Input()
    ukey: string; // this is the key to identify the Reporter

    @Input()
    org: string;

    @Input()
    curlang: string;

    @Input()
    height: number;

    @Input()
    width: number;

    @Input()
    deviceid: number;

    rewards: GSPReward[];
    curreward: GSPReward;

    entries: GSP[];
    redemptions: GSPReward[];
    addprogram = false;
    programid: string;
    err = false;
    redeem = false;
    available: number;
    pointsredeemed = 0;
    instructions = false;
    $sub1;
    $sub2;
    email1: string;
    email2: string;
    extensions: string;

    constructor(private rs: RogspLibService, private db: AngularFireDatabase) {

    }

    ngOnInit() {
        // the assumption here is that the user's ukey is passed as a parameter because the user has already registered.
        // and of course we know the device id
        this.rs.org = this.org;
        this.rs.ukey = this.ukey;
        this.rs.height = this.height;
        this.rs.width = this.width;
        this.rs.curlang = this.curlang;
        this.rs.device_id = this.deviceid;

        this.rs.getObject(`Orgs/${this.org}/profile/orgdata/emailextentions`).take(1).subscribe(ext => {
            this.extensions = ext;
        });


        this.$sub1 = this.rs.getList(`Devices/${this.deviceid}/GSP/entries/`).subscribe(entries => {
            this.entries = entries;

            this.available = 0;
            if (this.entries && this.entries.length > 0) {
                this.entries.forEach(e => this.available = this.available + e.points * 1);
            }
            this.$sub1 = this.rs.getList(`Devices/${this.deviceid}/GSP/redeems`).subscribe(redemptions => {
                this.redemptions = redemptions;
                console.log('re', this.redemptions)

                if (this.redemptions && this.redemptions.length > 0) {
                    this.redemptions.forEach(e => {
                        this.pointsredeemed = this.pointsredeemed + e.points * 1;
                    });
                }

                this.$sub2 = this.rs.getList(`Orgs/${this.org}/GSP/rewards`).subscribe(rws => {
                    const curdate = new Date().getTime();
                    const tst = new Date(rws[2].expires).getTime();
                    this.rewards = rws.filter(r => (r.points <= this.available) &&
                        (r.quantity - r.quantityused > 0) &&
                        (new Date(r.expires).getTime() >= curdate));
                });
            });
        });
    }

    onAdd() {
        this.addprogram = true;
    }

    onRedeem() {
        this.redeem = true;
    }

    onCancelPurchase() {
        this.redeem = true;
        this.err = false;
        this.instructions = false;
    }

    isValidEmail(): boolean {
        const x = this.email1.includes(this.extensions);
        return this.email1.includes(this.extensions);
    }

    onContinuePurchase() {
        if (this.email1 && this.email2 && this.isValidEmail() && (this.email1 === this.email2)) {

            const gsp = new GSPRedeem;
            gsp.email = this.email1;
            gsp.date = new Date().toISOString();
            gsp.ukey = this.db.createPushId();
            this.rs.setObjNoSnack(`Orgs/${this.org}/GSP/redeems/${this.curreward.ukey}/${gsp.ukey}`, gsp);

            this.curreward.quantityused = this.curreward.quantityused + 1;
            this.rs.setObjNoSnack(`Orgs/${this.org}/GSP/rewards/${this.curreward.ukey}/quantity`, this.curreward.quantity);

            const red = new GSPDeviceRedeem;
            red.name = this.curreward.name;
            red.programId = this.curreward.ukey;
            red.points = this.curreward.points;
            red.date = gsp.date;
            red.ukey = this.db.createPushId();

            this.rs.setObjNoSnack(`Devices/${this.deviceid}/GSP/redeems/${red.ukey}`, red);
            this.err = false;
            this.redeem = false;
            this.instructions = false;
        } else {
            this.err = true;
        }
    }

    onPurchase(i) {
        this.curreward = this.rewards[i];
        this.redeem = false;
        this.instructions = true;
    }

    onDone() {
        this.redeem = false;
    }

    onCancel() {
        this.err = false;
        this.programid = '';
        this.addprogram = false;

    }

    onSave() {
        this.rs.getObject(`Orgs/${this.org}/GSP/programs/${this.programid}`).take(1).subscribe(g => {
            if (!g) {
                this.err = true;
            } else {
                this.err = false;
                this.programid = '';
                this.addprogram = false;
                console.log('g', g)
                const gsp = new GSP;
                gsp.points = g.points;
                gsp.id = g.id;
                gsp.name = g.name;
                gsp.date = new Date().toISOString();
                gsp.creator = this.deviceid.toString();
                gsp.category = g.category;
                console.log('gsp1');
                this.rs.setObjNoSnack(`Devices/${this.deviceid}/GSP/entries/${gsp.id}`, gsp);
                console.log('gsp2');
                this.rs.setObjNoSnack(`Orgs/${this.org}/GSP/awards/${gsp.id}/${gsp.creator}`, gsp);
            }
        });
    }

    ngOnDestroy() {
        if (this.$sub1) {
            this.$sub1.unsubscribe();
        }

        if (this.$sub2) {
            this.$sub2.unsubscribe();
        }
    }

}
