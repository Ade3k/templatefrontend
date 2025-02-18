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
  selector: 'app-messaging-groupe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messaging-groupe.component.html',
  styleUrls: ['./messaging-groupe.component.css']
})
export class MessagingGroupeComponent implements OnInit {
  
  public roomId: string = '';
  public messageText: string = '';
  public messageArray: { user: string; message: string }[] = []; // Tableau contenant l'historique des messages échangés dans la salle de discussion.
  public selectedUsers: User[] = [];
  public groups: any[] = []; // Liste des groupes auxquels l'utilisateur appartient.
  
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

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        this.loadFriends();
        this.loadUserGroups(); // Charger les groupes de l'utilisateur
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

  toggleUserSelection(user: User): void {
    const index = this.selectedUsers.findIndex(u => u._id === user._id);
    if (index === -1) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }
  
  // Charger la liste des amis de l'utilisateur actuellement connecté.
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

  // Charger les groupes de l'utilisateur
  loadUserGroups(): void {
    if (this.currentUser) {
      this.chatService.getUserGroups(this.currentUser._id).subscribe({
        next: (groups) => {
          console.log(groups)
          this.groups = groups;  // Mettre à jour la liste des groupes
        },
        error: (err) => console.error('Erreur lors du chargement des groupes :', err),
      });
    }
  }

  // Méthode pour ouvrir un modal
  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }

  createGroupChat(): void {
    if (this.selectedUsers.length > 0) {
      // Récupération des IDs des utilisateurs sélectionnés
      const userIds = this.selectedUsers.map(user => user._id);
      // Filtrage des valeurs undefined
      const filteredUserIds: string[] = userIds.filter((id): id is string => id !== undefined);
      
      // Appel à createGroupRoom avec la liste filtrée
      this.chatService.createGroupRoom(this.currentUser._id, filteredUserIds).subscribe({
        next: (room) => {
          console.log("Groupe créé avec succès :", room.roomId);
          
          // Mettre à jour la liste des groupes sans ouvrir la discussion immédiatement
          this.loadUserGroups(); // Recharge la liste des groupes
        },
        error: (err) => console.error("Erreur lors de la création du groupe :", err),
      });
    } else {
      console.log("Veuillez sélectionner au moins un ami.");
    }
  }
  

  // Méthode pour charger les messages d'un salon spécifique en utilisant le service 'chatService'
  loadMessages(): void {
    this.chatService.getMessages(this.roomId).subscribe({
      next: (messages) => {
        this.messageArray = messages.map(msg => ({
          ...msg,
          photo: this.getUserPhoto(msg.user) // Ajoute la photo de l'utilisateur
        }));
        console.log(this.messageArray); // Vérifie que photo est bien présent
      },
      error: (err) => console.error("Erreur lors du chargement des messages :", err),
    });
  }

  getUserPhoto(userName: string): string {
    const user = this.userList.find(u => u.firstName === userName);
    return user ? 'http://localhost:3000/' + user.photo : 'assets/default-avatar.png';
  }

  // Méthode pour permettre à un utilisateur de rejoindre un salon
  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  // Méthode pour permettre à l'utilisateur d'envoyer un message dans un salon
  sendMessage(): void {
    if (this.messageText.trim()) {
      const message = {
        user: this.currentUser.firstName,
        message: this.messageText,
        room: this.roomId,
      };
      this.chatService.sendMessage(message);
      this.chatService.saveMessage(message).subscribe(
        () => {},
        (error) => {
          console.error('Erreur lors de la sauvegarde du message:', error);
        }
      );

      this.messageText = '';
    }
  }

  // Méthode pour rejoindre un groupe existant
  joinGroup(groupId: string): void {
    console.log("mygroupId", groupId)
    this.roomId = groupId;
    this.messageArray = [];
    this.loadMessages(); // Charger les messages du groupe
    this.join(this.currentUser.firstName, groupId); // Rejoindre le groupe
  }
}
