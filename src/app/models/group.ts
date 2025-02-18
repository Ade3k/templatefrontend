import { User } from './user'; // Assurez-vous que le modèle User existe et est bien importé

export interface Group {
  id: string;
  name: string;
  users: User[];
}