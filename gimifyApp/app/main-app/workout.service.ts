import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, validateEventsArray } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupInterface } from './interfaces/groups.interface';
import { WorkoutDaysInterface } from './interfaces/workout.days.interface';
import { ExerciceInterface } from './interfaces/exercice.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(
    private db: AngularFirestore
  ) { }


  //returns the information about each day of the week
  getDays(): Observable<any[]> {
    return this.db.collection('workout-days', (ref) => {
      return ref.orderBy('index');
    })
      .snapshotChanges()
      .pipe(map(a => {
        return a.map(element => {
          let data = element.payload.doc.data();
          let id = element.payload.doc.id;
          return {id, ...data};
        })
      }));
  }

  getParticularDay(id: string): Observable<unknown[]>{
    let url = '/workout-days/' + id + '/groups';

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

  getExercices(dayId: string, groupId: string): Observable<unknown[]> {
    let url = 'workout-days/' + dayId + '/groups/' + groupId + '/exercices';
        
        return this.db.collection(url)
            .snapshotChanges()
            .pipe(map(elements => {
              return elements.map(value => {
                let data = <ExerciceInterface> value.payload.doc.data();
                let id = value.payload.doc.id;
                
                let tempObject = {
                  'id': id,
                  'imageUrl': data.imageUrl,
                  'name': data.name,
                  'estimatedTime': data.estimatedTime,
                  'sets': data.sets
                };

                return tempObject;
              });
            }));
  }

  //returns an observable containing al the exercices in the database
  getBasicExercices(): Observable<unknown[]> {
    return this.db.collection('exercices')
      .valueChanges();
  }

  addGroup(data: WorkoutDaysInterface, group: GroupInterface,  dayId: string): void {

    this.db.collection('workout-days').doc(dayId)
      .update({
        'estimatedTime': data.estimatedTime,
        'noOfExercices': data.noOfExercices
      }).then(() => {
        this.db.collection('workout-days').doc(dayId)
          .collection('groups').add({
            'groupName': group.groupName,
            'estimatedTime': group.estimatedTime,
            'noOfExercices': group.noOfExercices
          })
            .then((value: firebase.firestore.DocumentReference) => {
              group.exercices.forEach((elem: ExerciceInterface) => {
                value.collection('exercices').add(elem);
              });
            })
            .catch((error: Error) => {
              console.log(error);
            })
      })
        .catch((error: Error) => {
          console.log(error);
        })

  }

  deleteExercice(idDay: string, idGroup: string, idExercice: string): Promise<void> {
    let url = 'workout-days/' + idDay + '/groups/' + idGroup + '/exercices/';
    
    return this.db.collection(url).doc(idExercice).delete();

  }

  updateInfo(dataDay, dataGroup, dayId: string, groupId: string, deleteGroup: boolean): void {

    let errorMessage = 'Error updating data on workout: ';

    //cazul in care o grupa anume trebuie stearsa
    if (deleteGroup) {
      this.db.collection('workout-days').doc(dayId).collection('groups').doc(groupId).delete()
        .then(() => {
          this.db.collection('workout-days')
          .doc(dayId)
          .update(dataDay)
          .then(() => {
            return;
          })
          .catch(error => {
            console.log(errorMessage, error);
            return;
        });
        })
        .catch(error => {
          console.log(error);
        });
    } else {

      //cazul in care o grupa anume nu ramane nu trebuie starsa
      this.db.collection('workout-days')
        .doc(dayId)
        .update(dataDay)
        .then(() => {
          this.db.collection('workout-days')
            .doc(dayId).collection('groups')
            .doc(groupId)
            .update(dataGroup)
            .catch(error => {
              console.log(errorMessage, error);
            })
            
        })
        .catch(error => {
          console.log(errorMessage, error);
        });
    }
  }
}
