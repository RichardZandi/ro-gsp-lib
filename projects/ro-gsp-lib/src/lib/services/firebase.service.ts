import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs';

@Injectable()
export class FirebaseService {

    constructor(private db: AngularFireDatabase) {
    }

}
