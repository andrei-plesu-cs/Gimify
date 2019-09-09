import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkoutService } from '../../workout.service';
import { GroupInterface } from '../../interfaces/groups.interface';
import { ExerciceInterface } from '../../interfaces/exercice.interface';
import { WorkoutDaysInterface } from '../../interfaces/workout.days.interface';

interface InputData {
  dayName: string,
  exercices: number,
  estimatedTime: number,
  id: string
}

@Component({
  selector: 'app-edit-workout-day',
  templateUrl: './edit-workout-day.component.html',
  styleUrls: ['./edit-workout-day.component.scss']
})
export class EditWorkoutDayComponent implements OnInit, OnDestroy {

  inputData: InputData;
  loadingState: boolean = false;
  paramSubscription: Subscription
  queryParamSubscription: Subscription;
  groupsSubscription: Subscription;
  groups: GroupInterface[] = [];
  isChangeGroup: boolean[] = [];
  showAddGroup: boolean = false;
  addGroupInput: string = '';
  showSearchExercice: boolean = false;
  tempExercices: ExerciceInterface[] = [];

  constructor(
    private currentRoute: ActivatedRoute,
    private router: Router,
    private service: WorkoutService
  ) { }

  ngOnInit() {

    this.loadingState = true;
    this.inputData = {
      dayName: '',
      estimatedTime: 0,
      exercices: 0,
      id: ''
    }

    this.paramSubscription = this.currentRoute.params
      .subscribe((params: Params) => {
        this.inputData.dayName = params.day;
      }, (error: Error) => {
        console.log(error.message);
        this.loadingState = false;
      })

    this.queryParamSubscription = this.currentRoute.queryParams
      .subscribe((params: Params) => {
        this.inputData.estimatedTime = params.estimatedTime;
        this.inputData.exercices = params.exercices;
        this.inputData.id = params.id;
      }, (error: Error) => {
        this.loadingState = false;
        console.log(error.message);
      });

    //read the data
    this.readData();

  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.queryParamSubscription.unsubscribe();
    this.groupsSubscription.unsubscribe();
  }

  checkInput(): string {
    return `${this.inputData.exercices} exercices, ${this.inputData.estimatedTime} mins`
  }

  //function used to read the data from the server
  readData(): void {

    this.loadingState = true;

    this.groupsSubscription = this.service.getParticularDay(this.inputData.id)
      .subscribe(result => {
        this.groups = <GroupInterface[]> result;
        for(let i=0; i<this.groups.length; i++) {
          this.service.getExercices(this.inputData.id, this.groups[i].id)
            .subscribe(result => {
              this.groups[i].exercices = <ExerciceInterface[]> result;
            }, error => {
              console.log(error);
            })
        }

        this.loadingState = false;
      }, error => {
        console.log(error);
    });

  }

  addGroup(): void {
    this.showAddGroup = true;
    this.addGroupInput = '';
  }

  saveDayPlan(): void {
    this.router.navigate(['../'], {
      relativeTo: this.currentRoute
    })
  }

  addToSchematic(): void {

  }

  discardGroup(): void {
    this.showAddGroup = false;
    this.addGroupInput = '';
    this.showSearchExercice = false;
  }

  addNewExercice(): void {
    this.showSearchExercice = true;
  }

  //modifies an existing group into the workout
  modifyGroup(index: number): void {
    if (this.isChangeGroup[index]) {
      this.isChangeGroup = [];
    } else {
      this.isChangeGroup = [];
      this.isChangeGroup[index] = true;
    }

  }

  exerciceAdded(exercice: ExerciceInterface): void {
    this.tempExercices.push(exercice);
    console.log(this.tempExercices.length);
    this.showSearchExercice = false;
  }

  saveGroup(): void {

    let estimatedTime = 0;
    this.tempExercices.forEach(elem => {
      estimatedTime += elem.estimatedTime;
    });

    estimatedTime /= 60;
    estimatedTime = +estimatedTime.toPrecision(2);

    let tempData: GroupInterface = {
      estimatedTime: estimatedTime,
      groupName: this.addGroupInput,
      noOfExercices: this.tempExercices.length,
      id: 'bullshitId',
      exercices: this.tempExercices
    }

    let tempDayData: WorkoutDaysInterface = {
      estimatedTime: +this.inputData.estimatedTime + estimatedTime,
      name: this.inputData.dayName,
      noOfExercices: +this.inputData.exercices + this.tempExercices.length
    }

    this.inputData.estimatedTime = +this.inputData.estimatedTime + estimatedTime;
    this.inputData.exercices = +this.inputData.exercices + this.tempExercices.length;

    this.service.addGroup(tempDayData, tempData, this.inputData.id);
    this.showAddGroup = false;
    this.tempExercices = [];
    this.showSearchExercice = false;
    this.addGroupInput = '';
  }

  //function used to delete a given exercice from the database
  deleteExercice(exercice: ExerciceInterface, group: GroupInterface, index: number): void {

    if (! this.isChangeGroup[index]) {
      return;
    }

    this.service.deleteExercice(this.inputData.id, group.id, exercice.id)
      .then(() => {

        if(this.inputData.exercices === 1) {
          this.service.updateInfo({
            'estimatedTime': +0,
            'noOfExercices': +0
          }, {}, this.inputData.id, group.id, true);
          this.inputData.estimatedTime = +0;
          this.inputData.exercices = +0;

        } else if (group.noOfExercices === 1) {
          console.log('it works');

          this.service.updateInfo({
            'estimatedTime': +this.inputData.estimatedTime - group.estimatedTime,
            'noOfExercices': +this.inputData.exercices - 1
          }, {}, this.inputData.id, group.id, true);
          this.inputData.estimatedTime = +this.inputData.estimatedTime - group.estimatedTime;
          this.inputData.exercices = +this.inputData.exercices - 1;

        } else {
          let estimatedTime = exercice.estimatedTime/60;
          estimatedTime = +estimatedTime.toPrecision(2);

          this.service.updateInfo({
            'estimatedTime': +this.inputData.estimatedTime - estimatedTime,
            'noOfExercices': +this.inputData.exercices - 1
          }, {
            'estimatedTime': +group.estimatedTime - estimatedTime,
            'noOfExercices': +this.inputData.exercices - 1
          }, this.inputData.id, group.id, false);
          this.inputData.estimatedTime = +this.inputData.estimatedTime - estimatedTime;
          this.inputData.exercices = +this.inputData.exercices - 1;

        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  saveChanges(group: GroupInterface): void {
    console.log(group);

    this.isChangeGroup = [];
    this.service.updateInfo(
      {}, 
      {
        'groupName': group.groupName
      }, 
      this.inputData.id, 
      group.id, 
      false);
  }

}
