import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  //function that gets triggered when the submit button
  //is clicked
  onLogIn(event: NgForm): void {
    
    let data = {
      email: event.value.email,
      password: event.value.password
    }

    if (!data.email || !data.password) {
      console.log('Fake data');
      return;
    }

    this.authService.logInDefault(data);

  }

  //function used to log in to app with google provider
  onClickGoogle(): void {

    this.authService.logInGoogle();

  }

  //function used to log in to app with facebook provider
  onClickFacebook(): void {

    this.authService.logInFacebook();

  }

}
