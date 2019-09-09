
//interface used to describe an exercice
export interface ExerciceInterface {
    name: string,
    imageUrl: string
    estimatedTime: number,
    sets: number[],
    id: string
}