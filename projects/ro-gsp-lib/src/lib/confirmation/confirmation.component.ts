import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class ConfirmationComponent implements OnInit {
    email: string;
    email1: string;
    error = false

    constructor(public dialogRef: MatDialogRef<ConfirmationComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
    }

    onCancel() {
        this.dialogRef.close();
    }

    onSave() {
        if (this.email === this.email1) {
            this.dialogRef.close(this.email);
        } else {
            this.error = true;
        }
    }

}
