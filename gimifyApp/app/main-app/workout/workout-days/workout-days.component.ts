import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from '../../workout.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

interface WorkoutDayDetails {
  name: string,
  estimatedTime: number,
  noOfExercices: number,
  id: string
}

@Component({
  selector: 'app-workout-days',
  templateUrl: './workout-days.component.html',
  styleUrls: ['./workout-days.component.scss']
})
export class WorkoutDaysComponent implements OnInit, OnDestroy {

  daysArray: WorkoutDayDetails[] = []
  daysSubscription: Subscription;
  loadingState: boolean = false;

  constructor(
    private service: WorkoutService,
    private router: Router,
    private currentRoute: ActivatedRoute
    ) { }

  ngOnInit() {

    this.loadingState = true;
    this.daysSubscription =  this.service.getDays()
      .subscribe((result: WorkoutDayDetails[]) => {
        this.daysArray = result;
        this.loadingState = false;
      },
      (error: Error) => {
        this.loadingState = false;
        console.log(error.message);
      })

  }

  ngOnDestroy() {
    this.daysSubscription.unsubscribe();
  }

  decideText(day: WorkoutDayDetails): string {
    if (day.noOfExercices === 0 || day.estimatedTime === 0) {
      return 'No information yet';
    } else {
      return `${day.noOfExercices} exercices, about ${day.estimatedTime} minutes`;
    }
  }

  clickElement(day: WorkoutDayDetails): void {
    this.router.navigate([day.name], {
      relativeTo: this.currentRoute,
      queryParams: {
        exercices: day.noOfExercices,
        estimatedTime: day.estimatedTime,
        id: day.id
      }
    })
  }

}
