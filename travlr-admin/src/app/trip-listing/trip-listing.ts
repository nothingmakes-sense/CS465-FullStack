import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {trips} from '../data/trips';
import {TripCard} from '../trip-card/trip-card';
import {Trip} from '../models/trip';
import {TripData} from '../services/trip-data';
import {Router} from '@angular/router';


@Component({
  selector: 'app-trip-listing',
  imports: [CommonModule, TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListing implements OnInit{
  trips: Array<Trip> = [];
  message: string = '';

  constructor(private tripData: TripData, private router: Router) {
    console.log('trip-listing constructor')
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }
  private getStuff(): void {
    this.tripData.getTrips()
    .subscribe({
      next: (value:any) => {
        this.trips = value;
        if (value.length > 0){
          this.message = 'there are ' + value.length + ' trips';
        } else {
          this.message = 'there are no trips returned from DB';
        }
        console.log(this.message);
        //console.log('trips: ' + JSON.stringify(this.trips))
      },
      error: (err) => {
       
        console.log('Error' + err);
      }
    })
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}
