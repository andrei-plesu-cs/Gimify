import { Component, OnInit, OnDestroy } from '@angular/core';
import { NutritionService } from '../../nutrition.service';
import { NutritionDay } from '../../interfaces/nutrition.days.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nutrition-days',
  templateUrl: './nutrition-days.component.html',
  styleUrls: ['./nutrition-days.component.scss']
})
export class NutritionDaysComponent implements OnInit, OnDestroy {

  nutritionDays: NutritionDay[] = [];
  nutritionDaysSubscription: Subscription;
  loadingState: boolean = false;

  constructor(
    private service: NutritionService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.loadingState = true;

    this.nutritionDaysSubscription = this.service.getDays()
      .subscribe(
        (result: firebase.firestore.DocumentData) => {
          this.nutritionDays = <NutritionDay[]> result;
          this.loadingState = false;
        },
        (error) => {
          console.log(error);
          this.loadingState = false
        });

  }

  ngOnDestroy() {
    this.nutritionDaysSubscription.unsubscribe();
  }

  decideText(elem: NutritionDay): string {
    if (elem.calories === 0 || elem.noOfMeals === 0) {
      return 'No information yet...';
    } else {
      return `${elem.noOfMeals} meals, ${elem.calories} cal`
    }
  }

  clickElement(elem: NutritionDay): void {
    this.router.navigate([elem.dayName], {
      relativeTo: this.currentRoute,
      queryParams: {
        'calories': elem.calories,
        'noOfMeals': elem.noOfMeals,
        'id': elem.id
      }
    });
  }

}
