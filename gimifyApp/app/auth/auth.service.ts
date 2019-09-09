import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase'
import { UserCredentials } from './user.credential.interface'
import { AngularFirestore } from '@angular/fire/firestore'
import { Router } from '@angular/router';


//interface used to describe input data
interface UserData {
  email: string,
  password: string,
  repeat: string,
  username: string,
  notification: boolean
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;

  constructor(
    private auth: AngularFireAuth, 
    private db: AngularFirestore,
    private router: Router
    ) { }


  //function used to log in with google provider
  logInGoogle(): void {
    const provider = new auth.GoogleAuthProvider();
    this.auth.auth.signInWithPopup(provider)
      .then((result: auth.UserCredential) => {
        console.log(result.user.displayName);
        this.isAuthenticated = true;
        this.router.navigate(['/main']);
      })
      .catch((error: Error) => {
        console.log('error logging in with google: ' + error.message);
      })
  }

  //function used to log in with facebook provider
  logInFacebook(): void {

  }

  //function used to log in with email and password
  logInDefault(credentials: {email: string, password: string}): void {
    this.auth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    )
      .then((result: auth.UserCredential) => {
        this.isAuthenticated = true;
        this.router.navigate(['/main']);

      })
      .catch((error: Error) => {
        alert(error.message);
      })
  }

  //function used to create account with email and password
  createAccount(data: UserData): void {

    if (! this.checkInput(data)) {
      return;
    }

    let collection = this.db.collection('users');
    let myRouter = this.router;

    this.auth.auth.createUserWithEmailAndPassword(
      data.email,
      data.password
    )
    .then(function(result: auth.UserCredential) {
      const user = result.user;
      let userCredentials: UserCredentials = {
        username: data.username,
        notifications: data.notification,
        imageUrl: ''
      };

      collection.doc(user.uid).set(userCredentials)
        .then(function(result) {
          console.log('Added user credentials to the firestore: ' + result)
        })
        .catch(function(error: Error) {
          console.log('Error adding user credentials: ' + error)
        })

        alert('New accout succesfully created');
        myRouter.navigate(['/']);

    })
    .catch(function(error: Error) {
      alert(error.message);
    }); 

  }

  //function user to check wheter input is good or not
  checkInput(data: UserData): boolean {

    if (data.password !== data.repeat)
      return false
    if (! data.username) 
      return false;

    return true;
    
  }

  updateCalorieIntake(intake: number): Promise<void> {

    return this.db.collection('users').doc(this.auth.auth.currentUser.uid)
      .update({
        'calorieIntake': intake
      });

  }

}
