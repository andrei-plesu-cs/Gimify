import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-daily-intake',
  templateUrl: './daily-intake.component.html',
  styleUrls: ['./daily-intake.component.scss']
})
export class DailyIntakeComponent implements OnInit {

  activity_indicator = {
    sedentary: 1.53,
    active: 1.76,
    very_active: 2.25
  }
  my_var: string = 'Active'

  constructor(
    private service: AuthService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm): void {
    
    let BMR = 0;
    if (form.value.sex === 'male') {
      BMR = (10* +form.value.weight) + (6.25* +form.value.height) - (5* +form.value.age) + 5;
    } else {
      BMR = (10* +form.value.weight) + (6.25* +form.value.height) - (5* +form.value.age) - 161;
    }

    let calorie_intake = BMR * +this.activity_indicator[form.value.activity];
    this.service.updateCalorieIntake(calorie_intake)
      .then(() => {
        alert('New calorie intake: ' + calorie_intake);
        this.router.navigate(['../'], {
          relativeTo: this.currentRoute
        })
      })
      .catch(error => {
        console.log(error);
      })

  }

}
