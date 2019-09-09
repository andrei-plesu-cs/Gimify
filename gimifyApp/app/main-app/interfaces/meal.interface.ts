import { Aliment } from './aliment.interface';

//interface that describes a meal
export interface MealInterface {
    mealName: string,
    calories: number,
    grams: number,
    aliments: Aliment[],
    id: string;
}