import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],   // ← required for *ngIf, ngClass, formGroup
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {

  public editForm!: FormGroup;
  submitted = false;
  trip!: Trip;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripData: TripData
  ) {}

  // Convenience getter used by the template: f['code'], f['name'], etc.
  get f() {
    return this.editForm.controls;
  }

  ngOnInit(): void {
    // Retrieve the trip that was stored when the user clicked "Edit"
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Load the existing trip into the form
    this.tripData.getTrip(tripCode).subscribe({
      next: (value: any) => {
        this.trip = value;
        // Convert the date so the <input type="date"> accepts it
        this.trip.start = this.trip.start.toString().substring(0, 10) as any;
        this.editForm.patchValue(this.trip);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public onSubmit() {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripData.updateTrip(this.editForm.value).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
}