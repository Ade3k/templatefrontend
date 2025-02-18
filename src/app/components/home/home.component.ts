import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { PostService } from '../../services/postService/post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { FriendshipService } from '../../services/friendshipService/friendship.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  newComment = '';
  user: any = null;
  allUsers: any[] = [];
  posts: any[] = [];
  newPostContent: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;
  selectedUser: any = null;
  pendingRequests: any[] = [];
  friends: User[] = [];
  chats: { user: User; messages: any[]; newMessage?: string }[] = [];
  newMessage?: string;
  selectedPost: any = null;
  newCommentContent: string = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private friendshipService: FriendshipService
  ) {}

  private userSubscription: Subscription | null = null;
  
  isFriendWithUser(userId: string): boolean {
    return this.friends.some(friend => friend._id === userId);
  }
  
  // Méthode 'ngOnInit()' pour charger l'utilisateur connecté, écouter les changements d'utilisateur et met à jour ses publications
  ngOnInit(): void {
    this.loadUser().then(() => {
      this.userSubscription = this.authService.selectedUser$.subscribe(
        (user) => {
          console.log('this is the user baby', user);
          if (user) {
            this.selectedUser = user;
            console.log(
              'Utilisateur trouvé avec succès ! 🎉',
              this.selectedUser
            );
            this.loadPostsForUser(this.selectedUser._id);
            console.log(
              'Utilisateur sélectionné dans HomeComponent :',
              this.selectedUser
            );
          }
        }
      );
    });
  }

  // Méthode pour ajouter un commentaire à une publication
  saveComment(postId: string, content: string) {
    this.postService.addComment(postId, content).subscribe({
      next: (response) => {
        console.log('Commentaire ajouté avec succès', response),
          this.loadPosts();
          this.newComment = '';
        this.closeModal();
      },
      error: (error) =>
        console.log('Erreur lors de la publication du commentaire', error),
      complete: () => console.log('Requête terminée'),
    });
  }

  // Méthode pour se désabonner
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  

  // Fonction pour charger et afficher les publications d'un utilisateur
  private loadPostsForUser(userId: string): void {
    this.postService.getUserPosts(userId).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications :', err);
        this.errorMessage = 'Erreur lors du chargement des publications.';
      },
    });
  }

  // Méthode pour vérifier si l'utilisateur actuellement affiché (selectedUser) est bien l'utilisateur connecté (user)
  isUserProfile(): boolean {
    return (
      this.selectedUser && this.user && this.selectedUser._id === this.user._id
    );
  }

  // Méthode pour ouvrir un modal et y ajouter un commentaire à une publication
  openCommentModal(post: any): void {
    this.selectedPost = post;
    this.newCommentContent = '';

    // On tente de récupérer l'élément DOM du modal en utilisant son id
    const modalElement = document.getElementById('commentModal');
    if (modalElement) {
      // On crée une instance de Modal en passant l'élément récupéré
      const modal = new Modal(modalElement);
      modal.show();
    } else {
      console.error('Élément du modal introuvable.');
    }
  }

  // Méthode pour fermer le modal
  closeModal(): void {
    const cancelButton = document.querySelector(
      'button[data-bs-dismiss="modal"]'
    ) as HTMLButtonElement;
    if (cancelButton) {
      cancelButton.click();
    } else {
      console.error('Bouton Annuler introuvable.');
    }
  }

  // Fonction pour récupérer et gérer les informations de l'utilisateur connecté, afficher ses publications, ses amis,
  // et gérer l'état de chargement et les erreurs qui peuvent survenir durant ce processus.
  private loadUser(): Promise<void> {
    return firstValueFrom(this.authService.getUser())
      .then((data) => {
        this.user = data;
        this.selectedUser = data;
        this.loadPosts();
        this.isLoading = false;
        this.loadFriends();
      })
      .catch(() => {
        this.errorMessage =
          'Erreur lors du chargement des informations utilisateur.';
        this.isLoading = false;
      });
  }

  // Fonction pour charger (afficher) les publications d'un utilisateur
  private loadPosts(): void {
    this.postService.getUserPosts(this.selectedUser._id).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications :', err);
        this.errorMessage = 'Erreur lors du chargement des publications.';
      },
    });
  }

  // Fonction pour permettre à l'utilisateur de sélectionner un fichier et de le stocker pour l'utiliser dans une publication
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Fichier sélectionné :', this.selectedFile);
    }
  }

  // Méthode pour gérer la logique de création d'une publication
  createPost(): void {
    console.log("J'ai été cliqué");
    if (!this.newPostContent.trim() && !this.selectedFile?.name) {
      // if (!this.newPostContent.trim() \\ !this.selectedFile?.name) ET retiré le REQUIRED TRUE sur le model post.js
      console.error('Le contenu du message est vide.');
      return;
    }

    if (!this.user || !this.user._id) {
      console.error('Utilisateur connecté non défini.');
      this.errorMessage = 'Impossible de publier : utilisateur non identifié.';
      return;
    }

    const formData = new FormData(); // Envoyé vers le back
    formData.append('content', this.newPostContent);
    formData.append('Author', this.user._id);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    console.log("J'ai été cliqué"),
      // Appelle le service pour créer la publication en envoyant l'objet formData au backend
      this.postService.createPost(formData).subscribe({
        next: () => {
          this.newPostContent = '';
          this.selectedFile = null;
          this.loadPosts();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la publication :', err);
          this.errorMessage = 'Erreur lors de la création de la publication.';
        },
      });
  }

  // Méthode pour permettre à un utilisateur de publier un message avec ou sans image
  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe({
      next: (response) => { this.loadPosts(); // Recharge la liste des publications
        console.log('Publication suprimé avec succcès', response)},
      error: (error) => {console.log('Erreur lors de la suppression de la ppublication', error)},
      complete: () => {console.log('Requête terminée')}
    })
  }

  // Méthode pour charger la liste des amis de l'utilisateur en utilisant le service 'FriendshipService'
  loadFriends(): void {
    this.friendshipService.getFriends(this.user._id).subscribe({
      next: (data) => {
        this.friends = data.friends;
        console.log('voilà', data.friends);
      },
      error: (err) =>
        console.error('Erreur lors du chargement des amis :', err),
    });
  }

  // Méthode pour envoyer une demande d'amitié à un autre utilisateur en appelant le service 'friendshipService'
  sendFriendRequest(): void {
    if (!this.selectedUser || !this.selectedUser._id) return;
    this.friendshipService
      .sendFriendRequest(this.user._id, this.selectedUser._id)
      .subscribe({
        next: () => {
          console.log("Demande d'amitié envoyée !");
        },
        error: (err) =>
          console.error("Erreur lors de l'envoi de la demande :", err),
      });
  }

  // Méthode 'isFriend' pour vérifier si un utilisateur est un ami de l'utilisateur actuel
  isFriend(user: User): boolean {
    return this.friends.some((friend) => friend._id === user._id);
  }
}
