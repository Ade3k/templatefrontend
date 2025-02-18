// Interface représentant la structure des données d'un utilisateur dans l'application
export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  pseudonym: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
  photo?: string;
  bio?: string;
  preferences?: string[];
  friends?: string[];
  friendRequests?: string[];
  recommendations?: string[];
  isAdmin?: boolean;
  isOnline?: boolean;
  newMessage?: string;
  showRecommendations: boolean; // Ajoutez cette ligne

}
