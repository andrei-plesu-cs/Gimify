
//interface used to describe the users credentials or configurations
export interface UserCredentials {
    username: string,
    notifications: boolean,
    imageUrl: string,
    calorieIntake?: number
}