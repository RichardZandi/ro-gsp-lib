import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UseLog, UserDate} from 'ro-lib-lib';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {MatSnackBar} from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class RogspLibService {
    public device_id: number;
    public org: string;
    public ukey: string;
    public curlang: string;
    public height: number;
    public width: number;

    audio;
    source;
    playing: boolean;
    API_KEY = 'AIzaSyDIHdmtGhhguYpTK6VHpUxpPj6NQtIwmRY';
    oData = {
        'input':
            {
                'text': ''
            },
        'voice':
            {
                'languageCode': 'en-GB',
                'ssmlGender': 'FEMALE'
            },
        'audioConfig':
            {
                'audioEncoding': 'mp3'
            }
    };

    constructor(public snackBar: MatSnackBar,
                private db: AngularFireDatabase,
                private http: HttpClient) {
        this.audio = new Audio();
    }

    convertDataURIToBinary(audiotoconvert) {
        const raw = atob(audiotoconvert);
        const rawLength = raw.length;
        const audioarray = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            audioarray[i] = raw.charCodeAt(i);
        }
        return audioarray;
    }

    readText(txt: string) {
        this.oData.input.text = txt;
        this.http.post('https://texttospeech.googleapis.com/v1beta1/text:synthesize?fields=audioContent&key=' + this.API_KEY, this.oData)
            .take(1).subscribe(response => {
            const binary = this.convertDataURIToBinary(response['audioContent']);
            const blob = new Blob([binary], {type: 'audio/wav'});

            // './assets/test.mp3';
            // this code block works for Chrome but not for Safari
            this.audio.src = URL.createObjectURL(blob);
            this.audio.load();
            this.audio.play();
            this.audio.onended = function () {
                if (this.audio.src) {
                    URL.revokeObjectURL(this.audio.src);
                }
                this.playing = false;
            };

        });
    }

    stop() {
        this.audio.pause();
        if (this.audio.src) {
            URL.revokeObjectURL(this.audio.src);
        }
        this.audio.src = '';
    }

    createUnigueId(): string {
        return this.db.createPushId();
    }

    getList(pth): Observable<any[]> {
        return this.db.list<any>(pth).valueChanges();
    }


    async createUseLog(path) {
        if (this.device_id) {
            const userdate = new UserDate;
            userdate.deviceID = this.device_id.toString();
            userdate.datetimestamp = new Date().toISOString();
            this.db.list(`UseLog/${this.org}`,
                ref => ref.orderByChild('path').equalTo(path))
                .valueChanges().take(1).subscribe(item => {
                if (item.length > 0) {
                    const u = <UseLog>item[0];
                    u.userdate.push(userdate);
                    console.log('here', u);
                    this.db.object(`UseLog/${this.org}/${u.ukey}/userdate`).set(u.userdate);
                } else {
                    const uselog = new UseLog;
                    uselog.ukey = this.db.createPushId();
                    uselog.roapp = `${this.org}/Start Here`;
                    uselog.path = path;
                    uselog.userdate = [];
                    uselog.userdate.push(userdate);
                    this.db.object(`UseLog/${this.org}/${uselog.ukey}`).set(uselog);
                }
            });

            const arr = path.split('/')[1];
            let s = '';
            if (arr[0] === 'Community') {
                s = arr[1];

                this.db.list(`UseLog/${s}`,
                    ref => ref.orderByChild('path').equalTo(path))
                    .valueChanges().take(1).subscribe(item => {
                    if (item.length > 0) {
                        const u = <UseLog>item[0];
                        u.userdate.push(userdate);
                        console.log('here', u);
                        this.db.object(`UseLog/${s}/${u.ukey}/userdate`).set(u.userdate);
                    } else {
                        const uselog = new UseLog;
                        uselog.ukey = this.db.createPushId();
                        uselog.roapp = `${this.org}/Start Here`;
                        uselog.path = path;
                        uselog.userdate = [];
                        uselog.userdate.push(userdate);
                        this.db.object(`UseLog/${s}/${uselog.ukey}`).set(uselog);
                    }
                });
            }
        }
    }

    getObject(pth): Observable<any> {
        /*      todo: reimplment this function; it's not working
                this.createUseLog(pth);
        */
        return this.db.object(pth).valueChanges();
    }


    setQuery(pth, child, key): Observable<any> {
        return this.db.list(pth,
            ref => ref.orderByChild(child).equalTo(key))
            .snapshotChanges().map(changes => {
                return changes.map(c => {
                    return {ukey: c.payload.key, ...c.payload.val()};
                });
            });
    }
    
    setObj(pth, obj) {
        this.db.object(pth).set(obj)
            .then(res => {
                this.snackBar.open('Data saved', '', {
                    duration: 1000,
                });
            })
            .catch(err => {
                this.snackBar.open('Error:', err, {
                    duration: 1000,
                });
            });
    }

    setObjNoSnack(pth, obj) {
        this.db.object(pth).set(obj);
    }

    deleteObj(pth) {
        this.db.object(pth).remove();
    }

    getListLast(pth): Observable<any[]> {
        return this.db.list(pth, ref => {
            return ref
                .orderByKey()
                .endAt('-LNChpdii9iU5y_o33OR')
                .limitToLast(10);
        }).valueChanges();

    }


}

/*
.scan((acc, val) => {
    return val.concat(acc);
})*/
