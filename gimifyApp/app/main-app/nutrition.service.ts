
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { MealInterface } from './interfaces/meal.interface';
import { Aliment } from './interfaces/aliment.interface';
import { NutritionDay } from './interfaces/nutrition.days.interface';

@Injectable({
    providedIn: 'root'
})
export class NutritionService implements OnInit {

    //represents the nutrition collection
    nutritionCollection: AngularFirestoreCollection;
    alimentsCollection: AngularFirestoreCollection;

    constructor(
        private db: AngularFirestore
    ) {}

    ngOnInit() {
        this.nutritionCollection = this.db.collection('nutrition-days');
        this.alimentsCollection = this.db.collection('aliments');
    }

    //returns the aliments from the database
    getAliments(): Observable<firebase.firestore.DocumentData> {
        return this.db.collection('aliments').valueChanges();
    }

    //returns contents of nutritions-days database
    getDays() {
        return this.db.collection('nutrition-days', ref => {
            return ref.orderBy('index');
        })
            .snapshotChanges()
            .pipe(map(action => {
                return action.map(a => {
                    let data = a.payload.doc.data();
                    let id = a.payload.doc.id;
                    return {id, ...data};
                })
            }));
    }

    //gets meals from a particular day + id of each meal
    getParticularDay(id: string) {
        let url = '/nutrition-days/' + id + '/meals';

        return this.db.collection(url)
            .snapshotChanges()
            .pipe(map(action => {
                return action.map(a => {
                    let data = a.payload.doc.data();
                    let id = a.payload.doc.id;
                    return {id, ...data};
                });
            }))
    }

    addMealToDay(id: string, meal: MealInterface): void {
        let url = '/nutrition-days/' + id + '/meals';

        this.db.collection(url)
            .add({
                'mealName': meal.mealName,
                'calories': meal.calories,
                'grams': meal.grams
            })
            .then((result: firebase.firestore.DocumentReference) => {
                let id = result.id;
                let messageRef = this.db.collection(url).doc(id).collection('aliments');
                meal.aliments.forEach((alim: Aliment) => {
                    messageRef.add(alim)
                        .then(value => {
                            console.log('Added aliment ', alim);
                        })
                        .catch(error => {
                            console.log('Error writing aliment to database');
                        });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateDayInfo(id: string, info: NutritionDay): void {
        this.db.collection('nutrition-days')
            .doc(id).update({
                'calories': info.calories,
                'noOfMeals': info.noOfMeals,
                'dayName': info.dayName
            })
            .then(result => {
                console.log('Succesfully updated info on day with id ' + id);
            })
            .catch(error => {
                console.log(error);
            })
    }

    updateMealInfo(idDay: string, idMeal: string, data: any): void {
        let url = 'nutrition-days/' + idDay + '/meals';

        this.db.collection(url).doc(idMeal).update(data);
    }

    //gets ingredients of a particular meal
    getMealIngredients(idDay: string, idMeal: string): Observable<firebase.firestore.DocumentData> {
        let url = 'nutrition-days/' + idDay + '/meals/' + idMeal + '/aliments';
        
        return this.db.collection(url)
            .valueChanges();
    }

    deleteIngredient(aliment: Aliment, idMeal: string, idDay: string): void {
        let url = 'nutrition-days/' + idDay + '/meals/' + idMeal + '/aliments';

        this.db.collection(url, ref => {
            return ref.where('name', '==', aliment.name);
        }).snapshotChanges()
            .subscribe(value => {
                value.forEach(elem => {
                    elem.payload.doc.ref.delete();
                });
            })

    }

    deleteMeal(idDay: string, idMeal: string): void {
        let url = 'nutrition-days/' + idDay + '/meals';

        this.db.collection(url).doc(idMeal).delete();
    }

}