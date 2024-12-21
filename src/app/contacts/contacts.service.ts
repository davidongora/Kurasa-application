import { Injectable } from '@angular/core';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  imageUrl: string;
  isDeleted: boolean;
  isFavorite: boolean;
  selected: boolean;
  group: string;
  
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})



export class ContactsService {

  constructor() { }

  private contacts: Contact [] =[
    {
      id: 1,
      firstName: 'Rick ',
      lastName: 'Sanchez',
      email: 'john.doe@example.com',
      phoneNumber: '+254 701 234567',
      address: '123 Main St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      isDeleted: false,
      isFavorite: false,
      selected: false,
      group: 'Work',
    },
    {
      id: 2,
      firstName: 'Morty ',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+254 702 345678',
      address: '456 High St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      isDeleted: false,
      isFavorite: true,
      selected: false,
      group: 'Family',
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.johnson@example.com',
      phoneNumber: '+254 703 456789',
      address: '789 Elm St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      isDeleted: false,
      isFavorite: false,
      selected: false,
      group: 'Friends',
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      phoneNumber: '+254 704 567890',
      address: '321 Oak St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
      isDeleted: false,
      isFavorite: true,
      selected: false,
      group: 'Work',
    },
    {
      id: 5,
      firstName: 'Johnny ',
      lastName: 'Depp',
      email: 'chris.brown@example.com',
      phoneNumber: '+254 705 678901',
      address: '654 Pine St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg',
      isDeleted: false,
      isFavorite: false,
      selected: false,
      group: 'Family',
    },
    {
      id: 6,
      firstName: 'Sophia',
      lastName: 'Wilson',
      email: 'sophia.wilson@example.com',
      phoneNumber: '+254 706 789012',
      address: '987 Maple St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/6.jpeg',
      isDeleted: false,
      isFavorite: true,
      selected: false,
      group: 'Friends',
    },
    {
      id: 7,
      firstName: 'David',
      lastName: 'Taylor',
      email: 'david.taylor@example.com',
      phoneNumber: '+254 707 890123',
      address: '147 Cedar St, Nairobi',
      imageUrl: 'https://rickandmortyapi.com/api/character/avatar/7.jpeg',
      isDeleted: false,
      isFavorite: false,
      selected: false,
      group: 'Work',
    },
  ];
  

  getContacts():Contact[]{
    return this.contacts.filter(contact => !contact.isDeleted);
    return this.contacts;

  }

  // getContactById(id: number): Contact | undefined {
  //   return this.contacts.find(contact => contact.id === id && !contact.isDeleted);
  // }

  // get visibleContacts(): Contact[] {
  //   return this.contacts.filter(contact => !contact.isDeleted);
  // }


  // updateContact(updatedContact: Contact): void {
  //   const index = this.contacts.findIndex((c) => c.id === updatedContact.id);
  //   if (index !== -1) this.contacts[index] = updatedContact;
  // }

  softDeleteContact(id: number): void {
    const contact = this.contacts.find((c) => c.id === id);
    if (contact) contact.isDeleted = true;
  }



}
