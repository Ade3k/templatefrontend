import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FriendshipService {

  private apiUrl = 'https://5e94-2001-861-36c9-6a40-894-7475-54d8-6da5.ngrok-free.app/api/friendship';

  constructor(private http: HttpClient) {
    
  }

  // Méthode pour envoyer une demande d'ami
  sendFriendRequest(requesterId: string, recipientId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, { requesterId, recipientId });
  }
  
  // Méthode pour accepter une demande d'ami
  acceptFriendRequest(friendshipId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/accept/${friendshipId}`, {});
  }

  // Méthode pour refuser une demande d'ami
  declineFriendRequest(friendshipId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/decline/${friendshipId}`, {});
  }

  // Méthode pour récupérer la liste des amis d'un utilisateur
  getFriends(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends/${userId}`);
  }

  // Méthode pour récupérer la liste des demandes d'amis en attente pour un utilisateur
  getPendingRequests(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending/${userId}`);
  }

  sendRecommandation(friendId: string, recommendedFriendId: string):Observable<any> {
    return this.http.post(`${this.apiUrl}/recommandation`, { friendId, recommendedFriendId });
  }
}
