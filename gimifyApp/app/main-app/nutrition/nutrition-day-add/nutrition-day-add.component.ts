import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NutritionDay } from '../../interfaces/nutrition.days.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NutritionService } from '../../nutrition.service';
import { MealInterface } from '../../interfaces/meal.interface';
import { Aliment } from '../../interfaces/aliment.interface';

@Component({
  selector: 'app-nutrition-day-add',
  templateUrl: './nutrition-day-add.component.html',
  styleUrls: ['./nutrition-day-add.component.scss']
})
export class NutritionDayAddComponent implements OnInit, OnDestroy {

  //validators
  isChangeMeal: boolean[] = [];

  //queryParams and params
  myId: string = '';

  //holds data needed to construct the component
  isModified: boolean = false;
  tempAliments: Aliment[] = [];
  showSearchAliment: boolean = false;
  showAddMeal: boolean = false;
  addMealInput: string = '';
  meals: MealInterface[] = []
  inputData: NutritionDay;
  mealsSubscription: Subscription;
  tempSubs1: Subscription;
  tempSubs2: Subscription;
  loadingState: boolean = false;

  constructor(
    private currentRoute: ActivatedRoute,
    private service: NutritionService,
    private router: Router
  ) { }

  ngOnDestroy() {
    this.tempSubs1.unsubscribe();
    this.tempSubs2.unsubscribe();
    this.mealsSubscription.unsubscribe();
  }

  ngOnInit() {
    
    let dayName = '';
    let calories = 0;
    let noOfMeals = 0;

    this.tempSubs1 = this.currentRoute.params
      .subscribe((param: Params) => {
        dayName = param.day;
      }, (error) => {
        console.log(error);
      });

    this.tempSubs2 = this.currentRoute.queryParams
      .subscribe((params: Params) => {
        calories = params.calories;
        noOfMeals = params.noOfMeals;
        this.myId = params.id;
      }, (error) => {
        console.log(error);
      })

    this.inputData = {
      dayName: dayName,
      calories: calories,
      noOfMeals: noOfMeals,
      id: this.myId
    }

    console.log(this.inputData);

    //readTheData
    this.readData();

  }

  //function used to check the input in order to display corectlly
  checkInput(): string {

    return `${this.inputData.noOfMeals} meals, ${this.inputData.calories} cal`

  }

  addToSchematic(): void {
  
  }

  newAlimentAdded(item: Aliment): void {
    this.showSearchAliment = false;
    this.tempAliments.push(item);
  }

  addMeal(): void {
    this.addMealInput = '';
    this.showAddMeal = true;
  }

  addNewAliment(): void {
    this.showSearchAliment = true;
  }

  saveDayPlan(): void {
    this.router.navigate(['../'], {relativeTo: this.currentRoute});
  }

  saveMeal(): void {

    let data: MealInterface = {
      aliments: this.tempAliments,
      calories: 0,
      mealName: this.addMealInput,
      grams: 0,
      id: 'bullshitId'
    }

    this.tempAliments.forEach((alim: Aliment) => {
      data.calories += alim.calories;
      data.grams += alim.onePiece;
    });

    this.service.addMealToDay(this.myId, data);

    this.inputData.calories = +this.inputData.calories + +data.calories;
    this.inputData.noOfMeals = +this.inputData.noOfMeals + 1;

    this.service.updateDayInfo(this.myId, {
      'dayName': this.inputData.dayName,
      'calories': this.inputData.calories,
      'noOfMeals': this.inputData.noOfMeals
    });

    this.discardMeal();
    this.isModified = true;

  }

  discardMeal(): void {
    this.tempAliments = [];
    this.addMealInput = '';
    this.showSearchAliment = false;
    this.showAddMeal = false;
  }

  readData(): void {

    this.loadingState = true;

    this.mealsSubscription = this.service.getParticularDay(this.inputData.id)
      .subscribe(result => {
        this.meals = <MealInterface[]> result;
        for(let i=0; i<this.meals.length; i++) {
          this.service.getMealIngredients(this.inputData.id, this.meals[i].id)
            .subscribe(result => {
              this.meals[i].aliments = <Aliment[]> result;
            }, error => {
              console.log(error);
            })
        }

        this.loadingState = false;
      }, error => {
        console.log(error);
    });

  }

  modifyMeal(index: number): void {

    if (this.isChangeMeal[index]) {
      this.isChangeMeal = [];
      return;
    }

    this.isChangeMeal = [];
    this.isChangeMeal[index] = true;
  }

  deleteAliment(ingredient: Aliment, meal: MealInterface, index: number): void {

    if (! this.isChangeMeal[index]) {
      return;
    }

    console.log(meal.id, this.myId, ingredient);

    this.inputData.calories -= ingredient.calories;

    this.service.deleteIngredient(ingredient, meal.id, this.myId);

    this.service.updateMealInfo(this.myId, meal.id, {
      'calories': meal.calories - ingredient.calories,
      'grams': meal.grams - ingredient.onePiece
    });

    if (meal.calories == ingredient.calories || meal.grams == ingredient.onePiece) {
      this.inputData.noOfMeals -= 1;
      this.service.deleteMeal(this.myId, meal.id);
    }

    this.service.updateDayInfo(this.myId, {
      'calories': +this.inputData.calories,
      'dayName': this.inputData.dayName,
      'noOfMeals': +this.inputData.noOfMeals
    });
  }

  saveChanges(meal: MealInterface): void {
    this.isChangeMeal = [];
    this.service.updateMealInfo(
      this.inputData.id,
      meal.id,
      {
        'mealName': meal.mealName
      }
    )
  }

}
