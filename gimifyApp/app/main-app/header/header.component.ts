import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { UserCredentials } from 'src/app/auth/user.credential.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  //the currently logged user right here
  currentUser: firebase.User;
  userInfo: UserCredentials

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private route: Router,
    private currentRoute: ActivatedRoute
  ) { }

  ngOnInit()  {
  
    this.userInfo = {
      imageUrl: '',
      notifications: false,
      username: 'defaultUser'
    }

    this.currentUser = this.auth.auth.currentUser;
    this.db.collection('users').doc(this.currentUser.uid)
      .valueChanges()
      .subscribe((user: UserCredentials) => {
        this.userInfo = user;
      })
  }


}
