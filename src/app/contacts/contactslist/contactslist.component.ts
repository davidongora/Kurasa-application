import { Component, OnInit } from '@angular/core';
import { Contact, ContactsService } from '../contacts.service';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../theme.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-contactslist',
  imports: [CommonModule, FormsModule,MatSlideToggleModule, ReactiveFormsModule  ],
  templateUrl: './contactslist.component.html',
  styleUrls: ['./contactslist.component.css'],
})
export class ContactslistComponent implements OnInit {
  contactForm!: FormGroup ;

  contacts: Contact[] = [];
  visibleContacts: Contact[] = [];
  isGridView = true;
  selectedContact: Contact | null = null;
  contactBeingEdited: number | null = null;
  searchQuery = '';
  groups = ['Family', 'Friends', 'Work'];
  favorites: Contact[] = [];
  selectAll = false;
  selectedGroup: string = '';
  recentContacts: Contact[] = [];
  maxRecentContacts = 5; 


  deleteAll: boolean = false;

  constructor(private contactService: ContactsService, private themeService: ThemeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
    this.visibleContacts = this.contacts.filter((contact) => !contact.isDeleted);
    this.favorites = this.contacts.filter((c) => c.isFavorite);
    this.initializeForm();
    this.sortContactsAlphabetically();
    
  }


  private initializeForm(): void {
    this.contactForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailValidator
      ]]
    });
  }

  private addToRecentContacts(contact: Contact): void {
    this.recentContacts = this.recentContacts.filter((c) => c.id !== contact.id);
  
    this.recentContacts.unshift(contact);
  
    if (this.recentContacts.length > this.maxRecentContacts) {
      this.recentContacts.pop();
    }
  }

  sortContactsAlphabetically(): void {
    // console.log('Sorting contacts alphabetically...');

    this.visibleContacts.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
  
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const hasAtSymbol = control.value.includes('@');
    const hasDot = control.value.includes('.');
    const hasValidLength = control.value.length >= 5;
    const matchesPattern = emailPattern.test(control.value);
    
    if (!hasAtSymbol) {
      return { missingAtSymbol: true };
    }
    
    if (!hasDot) {
      return { missingDot: true };
    }
    
    if (!hasValidLength) {
      return { invalidLength: true };
    }
    
    if (!matchesPattern) {
      return { invalidFormat: true };
    }
    
    return null;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  viewContact(contact: Contact): void {
    this.selectedContact = contact;
    this.addToRecentContacts(contact);

  }

  addContact(newContact: Contact): void {
    this.contacts.push(newContact);
    this.sortContactsAlphabetically();
    this.addToRecentContacts(newContact);
  
    this.filterContacts(); 
  }

  closeDetail(): void {
    this.selectedContact = null;
  }

  editContact(contact: Contact): void {
    this.contactBeingEdited = contact.id;
  }


  isEmailValid(email: string): boolean {
    const control = { value: email } as AbstractControl;
    const validationResult = this.emailValidator(control);
    return validationResult === null; 
  }

  saveContact(contact: Contact): void {
    if (this.isEmailValid(contact.email)) {
      this.updateContact(contact);
      this.contactBeingEdited = null;
      this.sortContactsAlphabetically();
      this.filterContacts();
    }
  }

  updateContact(updatedContact: Contact): void {
    const index = this.contacts.findIndex((c) => c.id === updatedContact.id);
    if (index !== -1) this.contacts[index] = updatedContact;
  }

  softDeleteContact(id: number): void {
    this.contactService.softDeleteContact(id);
    const contact = this.contacts.find((c) => c.id === id);
    if (contact) contact.isDeleted = true;
    this.visibleContacts = this.contacts.filter((contact) => !contact.isDeleted);
  }

  isAnyContactSelected(): boolean {
    return this.contacts.some(contact => contact.selected);
  }

  bulkDelete(): void {
    if (confirm('Are you sure you want to delete selected contacts?')) {
      this.contacts = this.contacts.filter((contact) => !contact.selected);
      this.searchContacts();
    }
  }

  toggleFavorite(contact: Contact): void {
    contact.isFavorite = !contact.isFavorite;
    this.favorites = this.contacts.filter((c) => c.isFavorite);
  }

  toggleSelectAll(): void {
    this.visibleContacts.forEach(
      (contact) => (contact.selected = this.selectAll)
    );
    this.updateSelectedContacts();

  }
  
  filterByGroup(): void {
    this.visibleContacts = this.selectedGroup
      ? this.contacts.filter(contact => contact.group === this.selectedGroup)
      : this.contacts;
  }

  importContacts(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = e.target.result;
        const parsedData = this.parseCSV(csvData);
        this.contacts.push(...parsedData);
        this.filterContacts();
        // console.log('imported', this.contacts)
        this.sortContactsAlphabetically();
      };
      reader.readAsText(file);
    }
  }

  private parseCSV(data: string): Contact[] {
    const rows = data.split('\n');
    const headers = rows[0].split(',');

    return rows.slice(1).map((row) => {
      const values = row.split(',');
      const contact: any = {};
      headers.forEach((header, index) => {
        contact[header.trim()] = values[index]?.trim();
      });
      return contact as Contact;
    });
  }

  exportContacts(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts.csv');
    link.click();
  }

  private generateCSV(): string {
    if (this.contacts.length === 0) {
      return '';
    }

    const headers = Object.keys(this.contacts[0]);
    const csvRows = [headers.join(',')];

    this.contacts.forEach((contact) => {
      const values = headers.map((header) => contact[header] || '');
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }

  private filterContacts(): void {
    this.visibleContacts = this.contacts.filter(
      (contact) =>
        (!this.searchQuery ||
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())) &&
        (!this.groups || this.groups.includes(contact.group))
    );
  }

  get anyContactSelected(): boolean {
    return this.contacts.some((contact) => contact.selected);
  }

  deleteSelectedContacts(): void {
    if (confirm('Are you sure you want to delete selected contacts?')) {
      this.contacts = this.contacts.filter((contact) => !contact.selected);
      this.searchContacts();
    }
  }

  updateSelectedContacts(): void {
    this.visibleContacts.forEach((contact) => {
      if (contact.selected) {
        this.updateSelection(contact);
      }
    });
  }

  updateSelection(updatedContact: Contact): void {
    const index = this.contacts.findIndex((c) => c.id === updatedContact.id);
    if (index !== -1) this.contacts[index] = updatedContact;
  }

  searchContacts(): void {
    const query = this.searchQuery.toLowerCase();
    this.visibleContacts = this.contacts.filter(
      (contact) =>
        !contact.isDeleted &&
        (contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query))
    );
  }
}
