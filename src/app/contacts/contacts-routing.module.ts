import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactslistComponent } from './contactslist/contactslist.component';

const routes: Routes = [
  {
    path: '',
    component: ContactslistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule {
  
 }
