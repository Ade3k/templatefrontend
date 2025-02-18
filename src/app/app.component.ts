// Importation des composants Angular nécessaires
import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostService } from './services/postService/post.service';
import { AuthService } from './services/authService/auth.service';
import { FriendshipService } from './services/friendshipService/friendship.service';
import { User } from './models/user';

// Déclaration de la classe AppComponent comme composant Angular
@Component({
  selector: 'app-root', // Sélecteur utilisé dans les templates HTML
  standalone: true, // Composant autonome (Angular 14+)
  imports: [
    RouterOutlet,
    NavbarComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'frontend'; // Titre de l'application  
  showNavAndSidebar = true;
  SideBars = true;// Indique si la barre de navigation et les barres latérales doivent être affichées  
  showSideBarLeft = true;
  selectedUser: any = null; // Utilisateur sélectionné pour voir ses informations 
  // Le mot-clé any permet à selectedUser de prendre n'importe quel type de valeur (string, number, object, etc.).
  // Valeur initiale 'null' : Cette initialisation indique que la variable ne pointe vers aucun utilisateur sélectionné au départ.

  user: any = null; // Utilisateur connecté  
  posts: any[] = []; // Liste des publications 
  // any[] signifie "tableau contenant des éléments de n'importe quel type" et 
  // = [] : Initialisation de la variable avec une liste vide.

  errorMessage: string | null = null; // Message d'erreur  
  pendingRequests: any[] = []; // Demandes d'amis en attente  
  isLoading: boolean = true; // État de chargement  
  friends: User[] = []; // Liste des amis  
  allUsers: any[] = []; // Liste de tous les utilisateurs  

  constructor(
    private authService: AuthService, // Service d'authentification  
    private postService: PostService, // Service pour gérer les publications  
    private router: Router, // Service Angular pour la navigation  
    private friendshipService: FriendshipService // Service pour la gestion des relations amicales  
  ) {
    // Gestion dynamique de l'affichage de la barre de navigation
    // Écoute des événements de navigation dans Angular via le Router
    this.router.events.pipe(
      // Utilisation de l'opérateur `filter` pour ne réagir qu'aux événements `NavigationStart`
      filter(event => event instanceof NavigationStart)
    )
      .subscribe(event => {
        // Vérification explicite que l'événement capturé est bien une instance de `NavigationStart`
        if (event instanceof NavigationStart) {
          // Mise à jour de la variable `showNavAndSidebar`
          // Elle sera `true` si l'utilisateur n'est pas sur les pages '/login' ou '/signup'
          this.showNavAndSidebar = !event.url.includes('/login')
            && !event.url.includes('/signup');
        }
      });

    // Gestion de la barre latérale gauche selon la page
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showSideBarLeft = !event.url.includes('/accueil');
      }
    });
    this.router.events.pipe(
      // Utilisation de l'opérateur `filter` pour ne réagir qu'aux événements `NavigationStart`
      filter(event => event instanceof NavigationStart)
    )
      .subscribe(event => {
        // Vérification explicite que l'événement capturé est bien une instance de `NavigationStart`
        if (event instanceof NavigationStart) {
          // Mise à jour de la variable `showNavAndSidebar`
          // Elle sera `true` si l'utilisateur n'est pas sur les pages '/login' ou '/signup'
          this.SideBars = !event.url.includes('/postsadmin') 
          && !event.url.includes("/usersadmin")
          && !event.url.includes("/onMessagingPrivateClick")
          && ! event.url.includes("/statistiquesadmin")
        }
    });
  }

  ngOnInit(): void {
    this.loadUser(); // Charge l'utilisateur connecté  
    this.getAllUsers(); // Récupère tous les utilisateurs  
    this.loadPendingRequests(); // Charge les demandes d'amis en attente  
  }

  acceptFriendRequest(requestId: string): void {
    // Accepte une demande d'ami
    this.friendshipService.acceptFriendRequest(requestId).subscribe({
      next: () => {
        this.loadFriends(); // Recharge les amis
        this.loadPendingRequests(); // Recharge les demandes en attente
        console.log("Demande d'amitié acceptée !");
      },
      error: (err) =>
        console.error("Erreur lors de l'acceptation de la demande :", err),
    });
  }

  declineFriendRequest(requestId: string): void {
    // Refuse une demande d'ami
    this.friendshipService.declineFriendRequest(requestId).subscribe({
      next: () => {
        this.loadPendingRequests();
        console.log("Demande d'amitié refusée.");
      },
      error: (err) =>
        console.error('Erreur lors du refus de la demande :', err),
    });
  }

  getAllUsers(): void {
    // Charge tous les utilisateurs sauf l'utilisateur connecté
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers = users.filter((user) => user._id !== this.user?._id);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
      },
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

  private loadUser(): void {
    // Charge l'utilisateur connecté et initialise ses données
    this.authService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.selectedUser = data;
        this.loadPosts();
        this.isLoading = false;
        this.loadFriends();
        this.loadPendingRequests();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’utilisateur :', err);
        this.errorMessage = 'Erreur lors du chargement des informations utilisateur.';
        this.isLoading = false;
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

  private loadPosts(): void {
    // Charge les publications de l'utilisateur connecté
    this.postService.getUserPosts(this.user._id).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications :', err);
        this.errorMessage = 'Erreur lors du chargement des publications.';
      },
    });
  }

  onProfileClick(): void {
    // Gère le clic sur le profil de l'utilisateur
    this.selectedUser = this.user;
    this.authService.setSelectedUser(this.user);
    this.loadPostsForUser(this.user._id);
  }

  onUserSelected(user: any): void {
    // Gère la sélection d'un utilisateur
    if (user._id) {
      this.authService.setSelectedUser(user);
      this.selectedUser = user;
      this.loadPostsForUser(user._id);
      this.router.navigate(['/home']);
    } else {
      console.error('Utilisateur sélectionné sans ID valide :', user);
    }
  }

  private loadPostsForUser(userId: string): void {
    // Charge les publications pour un utilisateur donné
    this.postService.getUserPosts(userId).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des publications.';
      },
    });
  }
}
