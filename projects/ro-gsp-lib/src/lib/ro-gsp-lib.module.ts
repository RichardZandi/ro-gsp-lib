import {NgModule} from '@angular/core';
import {RogspLibComponent} from './ro-gsp-lib.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule, MatNativeDateModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {GspShellComponent} from './gsp-shell/gsp-shell.component';
import 'rxjs/add/operator/take';
import {HttpClientModule} from '@angular/common/http';
import {RoLibLibModule} from 'ro-lib-lib';
import {ConfirmationComponent} from './confirmation/confirmation.component';


const firebaseConfig = {
    apiKey: 'AIzaSyCZYeiSVEp-gqu4av3j1277i9d7gIqsQcg',
    authDomain: 'library-titleix.firebaseapp.com',
    databaseURL: 'https://library-titleix.firebaseio.com',
    projectId: 'library-titleix',
    storageBucket: 'library-titleix.appspot.com',
    messagingSenderId: '60444556162'
};

@NgModule({
    imports: [
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CdkTableModule,
        MatCardModule,
        MatButtonModule,
        MatExpansionModule,
        MatInputModule,
        MatIconModule,
        MatGridListModule,
        MatMenuModule,
        MatDialogModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatSelectModule,
        MatTableModule,
        MatSidenavModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatFormFieldModule,

        RoLibLibModule,
    ],
    declarations: [
        GspShellComponent,
        RogspLibComponent,
        ConfirmationComponent,
    ],
    entryComponents: [
        ConfirmationComponent
    ],
    exports: [RogspLibComponent,
        GspShellComponent]
})
export class RogspLibModule {
}
