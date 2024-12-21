import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

import { ContactsRoutingModule } from './contacts-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    MatSlideToggleModule,
    
  ]
})
export class ContactsModule { }
