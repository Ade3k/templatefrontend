import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root', // Cette ligne indique que le service est disponible globalement dans l'application
  // (pas besoin de l'ajouter manuellement à la liste des providers).
})
export class AuthService {
  
  private apiUrl = 'http://localhost:3000/api/users'; // URL de l'API pour accéder aux données des utilisateurs

  constructor(private http: HttpClient) {}

  // Méthode pour créer un nouvel utilisateur via une requête POST avec des données de type FormData
  createUser(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${userId}`);
  }

  // Méthode pour connecter un utilisateur en envoyant ses informations d'identification (pseudo et mot de passe)
  login(credentials: { pseudonym: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  resetPassword(email: string): Observable<any> {
    const body = { email: email }; // On envoie l'email dans un objet
    return this.http.post(`${this.apiUrl}/resetPassword`, body)
      .pipe(
        catchError((error) => {
          console.error('Erreur de réinitialisation du mot de passe', error);
          return throwError(error);
        })
      );
  }
  
  // Méthode pour vérifier si l'utilisateur est authentifié en envoyant une requête GET sur un endpoint qui vérifie le token
  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<{ message: string }>(`${this.apiUrl}/verifyToken`)
      .pipe(
        map((response) => response.message === 'Authentifié'),
        catchError(() => of(false))
      );
  }

  // Méthode pour déconnecter un utilisateur en envoyant une requête GET au serveur pour détruire le token de session
  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`);
  }

  // Méthode pour récupérer les informations de l'utilisateur actuellement connecté
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Méthode pour récupérer tous les utilisateurs depuis l'API
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Utilisation d'un BehaviorSubject pour suivre et gérer l'utilisateur sélectionné dans l'application
  private selectedUserSubject = new BehaviorSubject<any>(null);
  selectedUser$ = this.selectedUserSubject.asObservable();

  // Méthode pour définir un utilisateur sélectionné, mise à jour de la valeur de selectedUserSubject
  setSelectedUser(user: any) {
    this.selectedUserSubject.next(user);
  }
}
