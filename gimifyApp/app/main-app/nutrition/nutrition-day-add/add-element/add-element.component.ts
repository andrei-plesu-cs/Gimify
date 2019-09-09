import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NutritionService } from 'src/app/main-app/nutrition.service';
import { Aliment } from 'src/app/main-app/interfaces/aliment.interface';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-add-element',
  templateUrl: './add-element.component.html',
  styleUrls: ['./add-element.component.scss']
})
export class AddElementComponent implements OnInit {

  @Output('addedAliment') addAliment: EventEmitter<Aliment> = new EventEmitter<Aliment>();

  searchWord: string = '';  
  aliments: Aliment[] = [];
  selected: Aliment = {
    name: '',
    calories: 0,
    imageUrl: '',
    onePiece: 0
  };
  selectat: boolean[] = [];

  constructor(
    private service: NutritionService
  ) { }

  ngOnInit() {
  }

  myFunc(): void {

    this.selectat = [];

    this.service.getAliments()
      .pipe(
        map(entry => {
          return entry.filter((elem: Aliment) => {
            return elem.name.toLowerCase().startsWith(this.searchWord)
              && this.searchWord;
          });
        })
      )
      .subscribe((result: firebase.firestore.DocumentData) => {
        this.aliments = <Aliment[]> result;
      }, (error) => {
        console.log(error);
      });

  }

  selectItem(index: number, item: Aliment): void {

    console.log('My index: ', index);
    if (this.selectat[index] === true) {
      this.selectat = [];
      this.selected = {
        name: '',
        calories: 0,
        imageUrl: '',
        onePiece: 0
      };

      return;
    }

    this.selected.name = item.name;
    this.selected.calories = item.calories;
    this.selected.imageUrl = item.imageUrl;
    this.selected.onePiece = item.onePiece;

    this.selectat = [];
    this.selectat[index] = true;
  }

  makeBalance(calories: boolean): void {
    console.log('da');

    // if (calories === false) {
    //   this.selected.calories = this
    // } else {
    //   this.selected.onePiece = 
    // }
  }

  //function used to add the selected item to current meal
  addToMeal(): void {
    this.addAliment.emit(this.selected);
  }

}
