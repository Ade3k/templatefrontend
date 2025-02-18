import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chatService/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { FriendshipService } from '../../services/friendshipService/friendship.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {
  
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: { user: string; message: string }[] = []; // Tableau contenant l'historique des messages échangés dans la salle de discussion.

  public currentUser: any = null;
  public selectedUser: any = null;
  public userList: User[] = [];

  constructor(
    private modalService: NgbModal,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private friendshipService: FriendshipService
  ) { }

  // Pour récupérer des informations utilisateur et la mise à jour en temps réel des messages par WebSocket
  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        this.loadFriends();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’utilisateur :', err);
      },
    });
    this.chatService
      .getMessage()
      .subscribe((data: { user: string; room: string; message: string }) => {
        console.log('Message reçu via WebSocket:', data);
        this.messageArray.push(data);
        console.log('Messages après ajout:', this.messageArray);
        this.cdr.detectChanges();
      });
  }

  // Pour charger la liste des amis de l'utilisateur actuellement connecté.
  loadFriends(): void {
    if (this.currentUser) {
      this.friendshipService.getFriends(this.currentUser._id).subscribe({
        next: (data) => {
          this.userList = data.friends;
        },
        error: (err) =>
          console.error('Erreur lors du chargement des amis :', err),
      });
    }
  }

  // Méthode pour ouvrir un modal
  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }

  // Méthode pour gérer l'interaction entre utilisateurs
  selectUserHandler(email: string): void {
    if (this.currentUser) {
      this.selectedUser =
        this.userList.find((user) => user.email === email) || null;
      if (this.selectedUser) {
        this.chatService
          .createRoom(this.currentUser._id, this.selectedUser._id)
          .subscribe({
            next: (room) => {
              console.log(
                'Room created avec succès sinon ça existe déja',
                room.roomId
              );
              this.roomId = room.roomId;
              this.messageArray = [];
              this.loadMessages();
              this.join(this.currentUser.firstName, this.roomId);
            },
            error: (err) =>
              console.error('Erreur lors de la création du room:', err),
          });
      } else {
        console.log('Aucun utilisateur trouvé avec cet email');
      }
    }
  }

  // Méthode pour charger les messages d'un salon spécifique en utilisant le service 'chatService'
  loadMessages(): void {
    if (this.roomId) {
      this.chatService.getMessages(this.roomId).subscribe((messages) => {
        this.messageArray = messages;
      });
    }
  }

  // Méthode pour permettre à un utilisateur de rejoindre un salon
  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  // Méthode pour permetttre à l'utilisateur d'envoyer un message dans un salon
  sendMessage(): void {
    if (this.messageText.trim()) {
      const message = {
        user: this.currentUser.firstName,
        message: this.messageText,
        room: this.roomId,
      };
      this.chatService.sendMessage(message);
      this.chatService.saveMessage(message).subscribe(
        () => { },
        (error) => {
          console.error('Erreur lors de la sauvegarde du message:', error);
        }
      );

      this.messageText = '';
    }
  }
}
