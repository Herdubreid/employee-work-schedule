import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
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
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressBarModule,
        MatCardModule
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatMenuModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressBarModule,
        MatCardModule
    ]
})
export class MaterialModule { }