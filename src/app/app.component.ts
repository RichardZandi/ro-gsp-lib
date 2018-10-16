import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import UserCredential = firebase.auth.UserCredential;
import {ArchiveList, HostContentInfo, HostDeviceInfo, HostMessageService, HostMessageServiceMock, Party, Phone} from 'ro-lib-lib';
import {AngularFireAuth} from 'angularfire2/auth';
import {RogspLibService} from '../../projects/ro-gsp-lib/src/lib/ro-gsp-lib.service';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    view = 'buttons';
    title = 'app';
    source: string;
    public subscription: Subscription;
    private APIConfig: any;
    isloading = true;

    read: boolean;
    startpage: number;
    height: number;
    width: number;
    deviceid: number;
    collegename: string;
    collegeid: number;
    curlang = 'en';
    authpassword: string;
    user: any;

    curphone: Phone;
    from: Party;
    to: Party[];

    public async signIn() {
        try {
            let signInResult: UserCredential;

            signInResult = await this.afAuth.auth.signInWithEmailAndPassword(`${this.deviceid}/@capptivation.com`, this.authpassword) as UserCredential;
            this.user = signInResult.user;
        } catch (err) {
            this.signUp();
            // this._snackBar.open(err.message, 'OK', {duration: 5000});
            return false;
        } finally {
            console.log('sign in done');
        }
    }

    public async signUp() {
        try {
            const userCredential: UserCredential = await this.afAuth.auth.createUserWithEmailAndPassword(`${this.deviceid}/@capptivation.com`, this.authpassword);
            await this.rs.setObj(`Devices/${this.deviceid}/admin`, userCredential.user.uid);
            this.user = userCredential.user;
        } catch (err) {
            console.log('Could not sign in');
        } finally {
            console.log('create done');
        }
    }

    constructor(private hostMessenger: HostMessageServiceMock,
                private afAuth: AngularFireAuth,
                @Inject(DOCUMENT) private document: Document,
                private rs: RogspLibService) {
        console.log('first in')
        this.subscription = this.hostMessenger.getMessage().subscribe(
            (message) => {
                console.log('host message')
                if (message.request === 'host_device_info') {
                    const deviceData: HostDeviceInfo = message.data; // Convert
                    this.authpassword = deviceData.api_auth_key;
                    this.deviceid = deviceData.device_id;
                    this.collegeid = deviceData.default_college_id;

                    // todo: this is for testing messaging and should be deleted when done
                    this.makeParties()

                    // try to signin
                    this.user = this.afAuth.auth.currentUser;
                    if (!this.user) {
                        this.signIn();
                        this.hostMessenger.getItem('app_config_data');
                    }
                }

                if (message.request === 'app_config_data') {
                    this.rs.getObject(`LegacyColleges/${this.collegeid}`).subscribe(college => {
                        this.collegename = college.consoleUkey;
                        this.isloading = false;
                    });

                }

                if (!message.request) {
                    this.testCase();
                }
            }
        );
    }


    makeParties() {
        this.from = new Party;
        this.from.name = 'Track Clark';
        this.from.phone = '';
        this.from.email = '';
        this.from.role = '';
        this.from.deviceid = this.deviceid;
        this.from.path = '';
        this.from.method = '';
        this.from.notes = [];
        this.from.ukey = '';
        this.from.color = '#039BE5';

        this.to = [];
        const party = new Party;
        party.name = 'Richard Zandi';
        party.phone = '';
        party.email = '';
        party.role = '';
        party.deviceid = 2001;
        party.path = '';
        party.method = '';
        party.notes = [];
        party.ukey = '';
        party.color = '#E53935';
        this.to.push(party);
    }

    testCase() {
        this.rs.getObject(`LegacyColleges/${this.collegeid}`).subscribe(college => {
            this.collegename = 'Daemen College';
            this.curlang = 'en';
            this.startpage = 0;
            this.read = true;
            this.deviceid = 1000;
            this.authpassword = `063f0888-c067-43a5-89ef-e422cf06b221`;
            this.signIn();

            this.isloading = false;
        });
    }

    ngOnInit() {
        const pathname = new URL(this.document.location.href);
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        if (pathname.search !== '') {            /*
                        http://localhost:4200/?&Westfield%20State%20Universirty&en&0&true&1000&-LNAsDhDu92HUbl3llsK&Template
            */
            const arr = this.document.location.href.replace(`${pathname.origin}${pathname.pathname}?`, '').split('&');
            this.collegeid = parseInt(arr[0], 10);
            this.collegename = arr[1];
            this.curlang = arr[2];
            this.startpage = parseInt(arr[3], 10);
            if (arr[4] === 'true') {
                this.read = true;
            } else {
                this.read = false;
            }
            this.deviceid = parseInt(arr[5], 10);
            this.authpassword = '';
            this.isloading = false;
        } else {
            this.testCase();
            /*
            this.hostMessenger.getItem('host_device_info');
*/
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe(); // unsubscribe to ensure no memory leaks
    }


}
