import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPageRoutingModule } from './ver-routing.module';

import { VerPage } from './ver.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPageRoutingModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
  ],
  declarations: [VerPage]
})
export class VerPageModule {}
