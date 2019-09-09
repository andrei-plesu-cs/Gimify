import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-main-workout',
  templateUrl: './main-workout.component.html',
  styleUrls: ['./main-workout.component.scss']
})
export class MainWorkoutComponent implements OnInit {

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute
    ) { }

  ngOnInit() {
  }

  //the methods are used right here
  onClickLink(option: string): void {

    //TODO
    if (option === 'schematics') {
      alert(option + ' not yet implemented');
      return;
    }

    this.router.navigate([option], {
      relativeTo: this.currentRoute
    })
  }

}
