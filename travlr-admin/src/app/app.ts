import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar, NavbarComponent } from './navbar/navbar';
import {CommonModule} from '@angular/common';
import {Login} from './login/login';
//import {TripListing} from './trip-listing/trip-listing';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Travlr Getaways Admin');
}
