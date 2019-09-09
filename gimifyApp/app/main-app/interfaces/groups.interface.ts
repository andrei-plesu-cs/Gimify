import { ExerciceInterface } from './exercice.interface';

//interface used to describe a group in a workout
export interface GroupInterface {
    groupName: string,
    noOfExercices: number,
    estimatedTime: number
    exercices: ExerciceInterface[],
    id: string
}