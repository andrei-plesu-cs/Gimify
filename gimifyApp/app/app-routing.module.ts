import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogInComponent } from './auth/log-in/log-in.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { MainWorkoutComponent } from './main-app/workout/main-workout/main-workout.component';
import { MainNutritionComponent } from './main-app/nutrition/main-nutrition/main-nutrition.component';
import { HomeComponent } from './main-app/home/home.component';
import { NutritionDaysComponent } from './main-app/nutrition/nutrition-days/nutrition-days.component';
import { NutritionDayAddComponent } from './main-app/nutrition/nutrition-day-add/nutrition-day-add.component';
import { WorkoutDaysComponent } from './main-app/workout/workout-days/workout-days.component';
import { EditWorkoutDayComponent } from './main-app/workout/edit-workout-day/edit-workout-day.component';
import { DailyIntakeComponent } from './main-app/nutrition/daily-intake/daily-intake.component';
import { AuthGuard } from './auth/auth.guard';
import { NoInfoIntakeComponent } from './main-app/nutrition/no-info-intake/no-info-intake.component';

const routes: Routes = [
  {
    path: '',
    component: LogInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'main',
    canActivate: [AuthGuard] ,
    component: MainScreenComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'workout',
        children: [
          {
            path: '',
            component: MainWorkoutComponent
          },
          {
            path: 'days',
            component: WorkoutDaysComponent
          },
          {
            path: 'days/:day',
            component: EditWorkoutDayComponent
          }
        ]
      },
      {
        path: 'nutrition',
        children: [
          {
            path: '',
            component: MainNutritionComponent,
          },
          {
            path: 'days',
            component: NutritionDaysComponent
          },
          {
            path: 'days/:day',
            component: NutritionDayAddComponent
          },
          {
            path: 'intake',
            component: NoInfoIntakeComponent
          },
          {
            path: 'intake/calculator',
            component: DailyIntakeComponent
          }
        ]
      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
