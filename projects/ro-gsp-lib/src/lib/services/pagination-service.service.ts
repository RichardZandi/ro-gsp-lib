import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/scan';

// Options to reproduce firestore queries consistently
interface QueryConfig {
    path: string; // path to collection
    field: string; // field to orderBy
    limit?: number; // limit per query
    reverse?: boolean; // reverse order?
    prepend?: boolean; // prepend to source?
}

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
// Source data
    private _done = new BehaviorSubject(false);
    private _loading = new BehaviorSubject(false);
    private _data = new BehaviorSubject([]);

    private query: QueryConfig;

    // Observable data
    data: Observable<any>;
    done: Observable<boolean> = this._done.asObservable();
    loading: Observable<boolean> = this._loading.asObservable();

    constructor(private db: AngularFireDatabase) {
    }

    firstkey: string;

    init(path, field, opts?) {
        this.query = {
            path,
            field,
            limit: 2,
            reverse: false,
            prepend: false,
            ...opts
        };

        const first = this.db.list(this.query.path, ref => {
            return ref
                .limitToLast(this.query.limit);
        });

        const valx = this.mapAndUpdate(first);
        console.log(valx);

        // Create the observable array for consumption in components
        this.data = this._data.asObservable()
            .scan((acc, val) => {
                return this.query.prepend ? val.concat(acc) : acc.concat(val);
            });
    }


    // Retrieves additional data from firestore
    more() {
        const cursor = this.getCursor();

        /*
                const more = this.db.list(this.query.path, ref => {
                    return ref
                        .limitToLast(this.query.limit)
                        .startAfter(cursor);
                })

                this.mapAndUpdate(more);
                */
    }


    // Determines the doc snapshot to paginate query
    private getCursor() {
        const current = this._data.value;
        if (current.length) {
            return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
        }
        return null;
    }

    // Maps the snapshot to usable format the updates source
    private mapAndUpdate(col) {
        if (this._done.value || this._loading.value) {
            return;
        }

        // loading
        this._loading.next(true);

        // Map snapshot with doc ref (needed for cursor)
        return col.snapshotChanges()
            .take(1)
            .subscribe();

    }


    // Reset the page
    reset() {
        this._data.next([]);
        this._done.next(false);
    }
}
