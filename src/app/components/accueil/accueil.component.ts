import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/postService/post.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/authService/auth.service';
import { Subscription } from 'rxjs';
import { FriendshipService } from '../../services/friendshipService/friendship.service';
import { User } from '../../models/user';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css',
})
export class AccueilComponent implements OnInit {
  newComment = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;
  user: any = null;
  selectedUser: any = null;
  newPostContent: string = '';
  posts: any[] = [];
  friends: User[] = [];
  selectedPost: any = null;
  newCommentContent: string = '';
  selectedFile: File | null = null;

  private userSubscription: Subscription | null = null;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private friendshipService: FriendshipService
  ) {}

  // Méthode 'isUserProfile()' pour vérifier si l'utilisateur actuellement sélectionné est le même que l'utilisateur connecté.
  isUserProfile(): boolean {
    return (
      this.selectedUser && this.user && this.selectedUser._id === this.user._id
    );
  }

  // Méthode 'onFileSelected' pour gérer l'événement de sélection d'un fichier
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Stocke le fichier sélectionné
      console.log('Fichier sélectionné :', this.selectedFile);
    }
  }

  // Méthode 'openCommentModal' pour ouvrir un modal de commentaires lorsqu'un utilisateur veut ajouter un commentaire à une publication
  openCommentModal(post: any): void {
    this.selectedPost = post;
    this.newCommentContent = '';
    const modalElement = document.getElementById('commentModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    } else {
      console.error('Élément du modal introuvable.');
    }
  }

  // Méthode 'closeModal' pour fermer un modal de commentaires
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

  // Méthode pour ajouter un commentaire à une publication, recharger les publication et fermer la modale après succès
  saveComment(postId: string, content: string) {
    this.postService.addComment(postId, content).subscribe({
      next: (response) => {
        console.log('Commentaire ajouté avec succès', response),
          this.loadPosts();
        this.closeModal();
        this.newComment = '';
      },
      error: (error) =>
        console.log('Erreur lors de la publication du commentaire', error),
      complete: () => console.log('Requête terminée'),
    });
  }

  // Méthode pour charger les informations de l'utilisateur lors de la conception du composant
  ngOnInit(): void {
    this.loadUser();
  }

  // Méthode appelée automatiquement lorsque le composant est détruit
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe(); // Désabonne l'observable pour éviter les fuites de mémoire
    }
  }

  // Méthode 'loadFriends()' pour récupérer la liste des amis de l'utilisateur connecté depuis le serveur
  loadFriends(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.friendshipService.getFriends(this.user._id).subscribe({
        next: (data) => {
          this.friends = data.friends;
          resolve();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des amis :', err);
          reject(err);
        },
      });
    });
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté
  loadUser(): void {
    this.authService.getUser().subscribe({
      next: async (data) => {
        this.user = data;
        this.selectedUser = data;
        this.loadPosts();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Erreur lors du chargement des informations utilisateur.';
        this.isLoading = false;
      },
    });
  }

  // Méthode pour permettre à un utilisateur de publier un message avec ou sans image
  createPost(): void {
    if (!this.newPostContent.trim() && !this.selectedFile?.name) {
      console.error('Le contenu du message est vide.');
      return;
    }

    if (!this.user || !this.user._id) {
      console.error('Utilisateur connecté non défini.');
      this.errorMessage = 'Impossible de publier : utilisateur non identifié.';
      return;
    }

    // Création de l'objet 'formData' pour envoyer les données sous forme de requête multipart/form-data
    const formData = new FormData();
    formData.append('content', this.newPostContent);
    formData.append('Author', this.user._id);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    // Envoi de la publication via le service PostService
    this.postService.createPost(formData).subscribe({
      next: () => {
        // Réinitialisation des champs après succès
        this.newPostContent = '';
        this.selectedFile = null;
        this.loadPosts(); // Recharge la liste des publications
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

  // Méthode pour assurer que les publications affichées proviennent bien de l'utilisateur et de ses amis
  async loadPosts(): Promise<void> {
    console.log('Avant le chargement des amis : ', this.friends);

    // Pour vérifier si la liste des amis est vide ou non définie
    if (!this.friends || this.friends.length === 0) {
      console.log('Aucun ami trouvé, chargement...');
      try {
        await this.loadFriends();
      } catch (error) {
        console.error('Erreur lors du chargement des amis :', error);
        return;
      }
    }

    console.log('Après chargement des amis : ', this.friends);

    // Pour extraire les IDs des amis et filtrer les valeurs nulles ou indéfinies
    const userIds: string[] = this.friends
      .map((friend) => friend._id)
      .filter((id): id is string => !!id);
    console.log("ID de l'utilisateur connecté :", this.user._id);

    if (this.user._id) {
      userIds.push(this.user._id);
    }

    // Charge les publications des amis et de l'utilisateur connecté
    this.postService.loadPostsForAllFriends(userIds).subscribe({
      next: (postsArray) => {
        this.posts = postsArray.flat();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des publications :', err);
        this.errorMessage = 'Erreur lors du chargement des publications.';
      },
    });
  }
}
