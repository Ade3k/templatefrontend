import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { User } from '../../models/user';
import { FriendshipService } from '../../services/friendshipService/friendship.service';
import { AuthService } from '../../services/authService/auth.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Dropdown } from 'bootstrap';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.css'],
  imports:[CommonModule]
})

export class SidebarRightComponent implements OnInit {
  @ViewChildren('dropdownButton') dropdownButtons!: QueryList<ElementRef>;
  friends: User[] = [];
  pendingRequests: any[] = [];
  @Output() acceptRequest = new EventEmitter<string>();
  @Output() declineRequest = new EventEmitter<string>();
  user: any = null;

  selectedFriend: string | null = null;
  recommendationLists: User[] = []; 

  constructor(
    private friendshipService: FriendshipService,
    private authService: AuthService
  ) {}
  showRecommendations: boolean = false; 
  ngOnInit(): void {
    this.loadUser();
    this.loadPendingRequests();
  }
  private loadUser(): void {
    // Charge l'utilisateur connecté et initialise ses données
    this.authService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loadFriends();
        this.loadPendingRequests();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’utilisateur :', err);
      },
    });
  }
  loadFriends(): void {
    // Charge la liste des amis
    this.friendshipService.getFriends(this.user._id).subscribe({
      next: (data) => {
        this.friends = data.friends;
      },
      error: (err) =>
        console.error('Erreur lors du chargement des amis :', err),
    });
  }
  loadPendingRequests(): void {
    // Charge les demandes d'amis en attente
    this.friendshipService.getPendingRequests(this.user._id).subscribe({
      next: (data) => {
        this.pendingRequests = data.pendingRequests;
      },
      error: (err) =>
        console.error('Erreur lors du chargement des demandes en attente :', err),
    });
  }
 

  
  loadRecommendations(friend: User): void {
  const userId = this.user?._id;
  console.log("my user id", userId); // Utilisation de l'opérateur de chaîne optionnelle
  if (!userId) return;

  const friendId = friend._id;
  console.log("my friend id", friendId);

  if (friendId) {
    // Utilisation de forkJoin pour appeler les deux getFriends en parallèle
    forkJoin([
      this.friendshipService.getFriends(userId),
      this.friendshipService.getFriends(friendId)
    ]).subscribe(([myFriendsResponse, friendFriendsResponse]) => {
      console.log("My friends : ", myFriendsResponse);  // Assurez-vous que c'est un objet avec une clé 'friends'
    
      const myFriends = myFriendsResponse?.friends || [];  // Accédez à la clé 'friends' dans la réponse
      const friendFriends = friendFriendsResponse?.friends || [];  // Accédez également à 'friends' pour l'autre réponse
    
      console.log("My friends (corrected): ", myFriends);
      console.log("Friends of my friend: ", friendFriends);
    
      // Filtrage des amis non-mutuels
      this.recommendationLists = myFriends.filter(
        (myFriend: User) =>
          !friendFriends.some((f: User) => f._id === myFriend._id) &&
          myFriend._id !== friendId
      );
    });

  } else {
    console.error('friendId is undefined');
  }
  console.log("ma recommandation list : ", this.recommendationLists);
}
  
onRecommend(friendId: string, recommendedFriendId: string) {
  console.log(`Recommandation envoyée de ${friendId} pour ${recommendedFriendId}`);
  this.friendshipService.sendRecommandation(friendId, recommendedFriendId).subscribe({
    next: () => {
      console.log("Recommandation envoyé avec succès")
    },
    error: (error) => {
      console.error('Erreur lors du chargement de l’utilisateur :', error);
    },
  });
}
  toggleDropdown(friend: User): void {
    friend.showRecommendations = !friend.showRecommendations;
    this.selectedFriend = this.selectedFriend === friend._id ? null : friend._id ?? null;
    this.loadRecommendations(friend);
  }
  onFriendClick(friend: any, index: number): void {
    // Simuler le clic sur le bouton de dropdown spécifique
    const dropdownButton = this.dropdownButtons.toArray()[index];
    if (dropdownButton) {
      dropdownButton.nativeElement.click();
    }
  }
  
  onAccept(requestId: string): void {
    this.acceptRequest.emit(requestId);
  }

  onDecline(requestId: string): void {
    this.declineRequest.emit(requestId);
  }
}
