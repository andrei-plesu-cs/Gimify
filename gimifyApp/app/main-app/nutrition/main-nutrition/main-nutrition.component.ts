import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-nutrition',
  templateUrl: './main-nutrition.component.html',
  styleUrls: ['./main-nutrition.component.scss']
})
export class MainNutritionComponent implements OnInit {

  urlToDisplay: string

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  //function that gets triggered each time a button is clicked
  onClickLink(whereTo: string): void {
    console.log('This is good ' + whereTo);
    this.router.navigate([whereTo], {
      relativeTo: this.currentRoute
    });
  }

}
