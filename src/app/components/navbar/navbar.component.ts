import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  allUsers!: User[];
  currentUser!: User;
  isAdmin = false;
  user: any = null; // Utilisateur connecté  

  constructor(private router: Router, private authService: AuthService) {}

  // Contrôle de recherche utilisé pour filtrer les utilisateurs
  searchControl: FormControl = new FormControl('');
  filteredUsers: User[] = [];
  @Output() userSelected = new EventEmitter<User>(); // Émet un événement quand un utilisateur est sélectionné
  @Output() profileClicked = new EventEmitter<void>(); // Émet un événement quand le profil est cliqué
  
  // Méthode appelée lors de l'initialisation du composant
  ngOnInit(): void {
    this.authService.getUser().subscribe((data) => {
      this.currentUser = data;
      console.log("mamama", this.currentUser);
      if (this.currentUser.isAdmin === true) {
        this.isAdmin = true;
      } // Affiche après la réception des données
    });
    this.getAllUsers();
    // Souscription aux changements de valeur du champ de recherche
    this.searchControl.valueChanges.subscribe((query) => {
      this.onSearch(query || '');
    });

  }

  getAllUsers(): void {
    // Charge tous les utilisateurs sauf l'utilisateur connecté
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users.filter((user) => user._id !== this.currentUser?._id);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
      },
    });
  }
  // Méthode de recherche qui filtre les utilisateurs en fonction du texte de recherche
  onSearch(query: string): void {
    query = query.toLowerCase(); // Convertir la recherche en minuscule pour une comparaison insensible à la casse
    this.filteredUsers = this.allUsers.filter(
      (user) =>
        user._id !== this.currentUser._id && // On exclut l'utilisateur connecté
        (`${user.firstName || ''} ${user.lastName || ''}`
          .toLowerCase()
          .includes(query) || // Comparaison sur le prénom et le nom
          (user.pseudonym || '').toLowerCase().includes(query)) // Comparaison sur le pseudonyme
    );
  }

  // Méthode qui est appelée lorsqu'un utilisateur est cliqué dans la liste filtrée
  onUserClick(user: User): void {
    this.userSelected.emit(user);
  }

  // Méthode qui est appelée lorsqu'on clique sur le profil
  onProfileClick(): void {
    this.profileClicked.emit();
    this.router.navigate(['/home']);
  }

  onMessagingPrivateClick(): void {
    this.router.navigate(['/onMessagingPrivateClick'])
  }
  
  onStatisticsClick() : void {
    this.router.navigate(['/statistiquesadmin'])
  }

  // Méthode qui est appelée lorsqu'on clique sur le bouton "Home"
  onHomeClick(): void {
    this.router.navigate(['/home']);
  }

  onUserAdmin(): void {
    this.router.navigate(['/usersadmin'])
  }

  onPostsAdminClick(): void {
    this.router.navigate(['/postsadmin'])
  }
  // Méthode qui est appelée lorsqu'on clique sur le bouton "Admin"
  onAdminClick(): void {
    this.router.navigate(['/admin']);
  }

  // Méthode qui est appelée lorsqu'on clique sur le bouton "Accueil"
  onAccueilClick(): void {
    this.profileClicked.emit();
    this.router.navigate(['/accueil']);
  }

  // Méthode qui est appelée lorsqu'on clique sur le bouton de messagerie
  onMessagingClick(): void {
    this.profileClicked.emit();
    this.router.navigate(['/messaging']);
  }
  onMessagingGroupeClick(): void {
    this.router.navigate(['/messagingGroupe']);
  }
  // Méthode qui est appelée lors du clic sur le bouton de déconnexion
  onLogoutClick(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion :', err);
      },
    });
  }
}
