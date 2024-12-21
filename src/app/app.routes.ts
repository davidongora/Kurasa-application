import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

export const appConfig = {
    providers: [
      provideHttpClient() 
    ]
  };