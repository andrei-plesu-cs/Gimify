import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserCredentials } from 'src/app/auth/user.credential.interface';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-no-info-intake',
  templateUrl: './no-info-intake.component.html',
  styleUrls: ['./no-info-intake.component.scss']
})
export class NoInfoIntakeComponent implements OnInit {

  currentUserData: UserCredentials;
  noDataYet: boolean = true;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.currentUserData = {
      imageUrl: '',
      notifications: false,
      username: ''
    }

    this.db.collection('users')
    .doc(this.auth.auth.currentUser.uid)
    .valueChanges()
    .subscribe((data: UserCredentials) => {
      this.currentUserData = data;
      if (! this.currentUserData.calorieIntake) {
        this.noDataYet = true;
      } else {
        this.noDataYet = false;
      }
    });

  }

  toCalculator(): void {
    this.router.navigate(['calculator'], {
      relativeTo: this.currentRoute
    });
  }

}
