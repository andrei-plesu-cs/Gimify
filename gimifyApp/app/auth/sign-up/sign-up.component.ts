import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  valError: boolean = false;

  //is bound to the form giving me access to it programatically here
  @ViewChild('f', {static: false}) myForm: NgForm;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  //method used to send data to firestore database
  onSubmit(): void {

    let data = {
      email: this.myForm.value.email,
      password: this.myForm.value.password,
      repeat: this.myForm.value.repeat,
      username: this.myForm.value.username,
      notification: this.myForm.value.notification
    }

    console.log('nu');
    if (data.password !== data.repeat || !this.myForm.valid) {
      console.log('da');

      this.valError = true;
      setTimeout(() => {
        this.valError = false;
      }, 1500);
      return;
    }

    this.authService.createAccount(data);

  }

}
