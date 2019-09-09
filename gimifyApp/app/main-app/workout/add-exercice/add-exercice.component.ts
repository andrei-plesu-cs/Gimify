import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BasicExercice } from '../../interfaces/basic.exercice.interface';
import { WorkoutService } from '../../workout.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators'
import { ExerciceInterface } from '../../interfaces/exercice.interface';

@Component({
  selector: 'app-add-exercice',
  templateUrl: './add-exercice.component.html',
  styleUrls: ['./add-exercice.component.scss']
})
export class AddExerciceComponent implements OnInit, OnDestroy {

  exercices: BasicExercice[] = [];
  searchItemInput: string = '';
  exerciceSubscription: Subscription;
  isSelected: boolean[] = [];
  tempItem: ExerciceInterface;
  repsInput: string = '';

  @Output('fireEvent') myEvent: EventEmitter<ExerciceInterface> = new EventEmitter<ExerciceInterface>();

  constructor(
    private service: WorkoutService
  ) { }

  ngOnInit() {
    this.newTempItem();
  }

  ngOnDestroy() {
    this.exerciceSubscription.unsubscribe();
  }

  myFunc(): void {
    this.exerciceSubscription = this.service.getBasicExercices()
      .pipe(map((elements: BasicExercice[]) => {
        return elements.filter(elem => {
          return elem.name.toLowerCase().startsWith(this.searchItemInput) 
            && this.searchItemInput;
        });
      }))
      .subscribe((value: BasicExercice[]) => {
        this.exercices = value;
      });
  }

  selectItem(index: number) {
    this.newTempItem();

    if (this.isSelected[index]) {
      this.isSelected = [];
      
    } else {
      this.isSelected = [];
      this.isSelected[index] = true;
    }
  }

  //adds a set to the target item
  addSet(): void {
    this.tempItem.sets.push(+this.repsInput);
    this.repsInput = "";
  }

  saveExercice(selected_item: BasicExercice): void {
    let estimatedTime = 0;
    
    this.tempItem.sets.forEach(item => {
      estimatedTime += item * selected_item.timePerRep;
    });

    this.tempItem.name = selected_item.name;
    this.tempItem.imageUrl = selected_item.imageUrl;
    this.tempItem.estimatedTime = estimatedTime;
    this.tempItem.id = 'randomIdRightHere';
    this.myEvent.emit(this.tempItem);
  }

  newTempItem(): void {
    this.tempItem = {
      estimatedTime: 0,
      id: '',
      imageUrl: '',
      name: '',
      sets: []
    }
  }

}
