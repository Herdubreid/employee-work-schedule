import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressBarModule,
    MatCardModule
} from '@angular/material';
/**
 * Material Modules
 */
@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressBarModule,
        MatCardModule
    ],
    exports: [
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressBarModule,
        MatCardModule
    ]
})
export class MaterialModule { }