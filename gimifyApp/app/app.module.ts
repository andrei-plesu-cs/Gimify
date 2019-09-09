import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire'
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFirestoreModule } from '@angular/fire/firestore'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HeaderComponent } from './main-app/header/header.component';
import { MainWorkoutComponent } from './main-app/workout/main-workout/main-workout.component';
import { MainNutritionComponent } from './main-app/nutrition/main-nutrition/main-nutrition.component';
import { HomeComponent } from './main-app/home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { AuthService } from './auth/auth.service';
import { NutritionService } from './main-app/nutrition.service'
import { NutritionDaysComponent } from './main-app/nutrition/nutrition-days/nutrition-days.component';
import { NutritionDayAddComponent } from './main-app/nutrition/nutrition-day-add/nutrition-day-add.component';
import { AddElementComponent } from './main-app/nutrition/nutrition-day-add/add-element/add-element.component';
import { WorkoutDaysComponent } from './main-app/workout/workout-days/workout-days.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { WorkoutService } from './main-app/workout.service';
import { EditWorkoutDayComponent } from './main-app/workout/edit-workout-day/edit-workout-day.component';
import { AddExerciceComponent } from './main-app/workout/add-exercice/add-exercice.component';
import { DailyIntakeComponent } from './main-app/nutrition/daily-intake/daily-intake.component';
import { AuthGuard } from './auth/auth.guard';
import { NoInfoIntakeComponent } from './main-app/nutrition/no-info-intake/no-info-intake.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SignUpComponent,
    HeaderComponent,
    MainWorkoutComponent,
    MainNutritionComponent,
    HomeComponent,
    PageNotFoundComponent,
    MainScreenComponent,
    NutritionDaysComponent,
    NutritionDayAddComponent,
    AddElementComponent,
    WorkoutDaysComponent,
    LoadingSpinnerComponent,
    EditWorkoutDayComponent,
    AddExerciceComponent,
    DailyIntakeComponent,
    NoInfoIntakeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService, NutritionService, WorkoutService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
