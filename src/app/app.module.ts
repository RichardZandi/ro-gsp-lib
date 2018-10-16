import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
    MatAutocompleteModule,
    MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTableModule, MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {RogspLibComponent} from '../../projects/ro-gsp-lib/src/lib/ro-gsp-lib.component';
import {GspShellComponent} from '../../projects/ro-gsp-lib/src/lib/gsp-shell/gsp-shell.component';
import {RoLibLibModule} from 'ro-lib-lib';
import {CdkTableModule} from '@angular/cdk/table';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import 'rxjs/add/operator/take';
import {ConfirmationComponent} from '../../projects/ro-gsp-lib/src/lib/confirmation/confirmation.component';
import { ScrollableDirectiveDirective } from '../../projects/ro-gsp-lib/src/lib/services/scrollable-directive.directive';
import {FlexLayoutModule} from '@angular/flex-layout';

const firebaseConfig = {
    apiKey: 'AIzaSyCZYeiSVEp-gqu4av3j1277i9d7gIqsQcg',
    authDomain: 'library-titleix.firebaseapp.com',
    databaseURL: 'https://library-titleix.firebaseio.com',
    projectId: 'library-titleix',
    storageBucket: 'library-titleix.appspot.com',
    messagingSenderId: '60444556162'
};


@NgModule({
    declarations: [
        AppComponent,
        GspShellComponent,
        RogspLibComponent,
        ConfirmationComponent,
        ScrollableDirectiveDirective,
    ],
    imports: [
        BrowserModule,
        MatProgressSpinnerModule,

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
        FlexLayoutModule,

        RoLibLibModule,
    ],
    entryComponents: [
        ConfirmationComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

/*
RZ: To build
1. first build thie library: ng build --prod ro-gsp-lib
2. then package it up: npm run npm_pack

to install library in console project
1. npm cache clean --force
2. npm install ../ro-gsp-lib/dist/ro-gsp-lib/ro-gsp-lib-0.0.2.tgz
2. add RogspLibModule to app.module.ts
*/
