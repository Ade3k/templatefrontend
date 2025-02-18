import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // Le service est fourni au niveau racine de l'application
})
export class ChatService {
  private socket: Socket; // Instance de Socket.IO pour la communication en temps réel
  private apiUrl = 'http://localhost:3000/api/messages'; // URL de l'API pour récupérer et envoyer les messages

  constructor(private http: HttpClient) {
    // Initialisation de la connexion socket avec les paramètres de transport
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
  }
// Méthode pour créer un groupe de discussion
createGroupRoom(adminId: string, userIds: string[]): Observable<{ roomId: string }> {
  return this.http.post<{ roomId: string }>(`${this.apiUrl}/group-rooms`, {
    adminId,
    userIds,
  });
}
  // Méthode pour récupérer les nouveaux messages en temps réel
  getMessage(): Observable<{ user: string; room: string; message: string }> {
    return new Observable((observer) => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });
    });
  }
  // Méthode pour récupérer les groupes de l'utilisateur
getUserGroups(userId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/users/${userId}/groups`);
}


  getAllMessages(): Observable<any> {
    return this.http.post('http://localhost:3000/api/messages/getallmessages', {});
  }

  // Méthode pour rejoindre une salle de chat spécifique
  joinRoom(data: any): void {
    this.socket.emit('join', data);
  }

  // Méthode pour envoyer un message à une salle
  sendMessage(data: any): void {
    this.socket.emit('message', data);
  }

  // Méthode pour récupérer les messages d'une salle donnée via une requête HTTP
  getMessages(room: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${room}`);
  }

  deleteMessage(messageId: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/messages/delete', { messageId });
  }

  // Méthode pour sauvegarder un message dans la base de données via une requête HTTP
  saveMessage(data: any): Observable<any> {
    console.log('data envoyé avant', data);
    return this.http.post<any>(this.apiUrl, data);
  }

  // Méthode pour créer un nouveau salon entre deux utilisateurs
  createRoom(user1Id: string, user2Id: string) {
    return this.http.post<{ roomId: string }>(`${this.apiUrl}/rooms`, {
      user1Id,
      user2Id,
    });
  }

  // Méthode pour récupérer les salles de chat d'un utilisateur
  getUserRooms(userId: string) {
    return this.http.get(`${this.apiUrl}/users/${userId}/rooms`);
  }
}
