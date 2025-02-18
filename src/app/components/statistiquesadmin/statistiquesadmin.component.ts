import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { PostService } from '../../services/postService/post.service';
import { ChatService } from '../../services/chatService/chat.service';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';

// Enregistrement des composants nécessaires, y compris BarController
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

@Component({
  selector: 'app-statistiquesadmin',
  templateUrl: './statistiquesadmin.component.html',
  styleUrls: ['./statistiquesadmin.component.css']
})
export class StatistiquesadminComponent implements OnInit {

  users: any[] = [];
  posts: any[] = [];
  messages: any[] = [];

  constructor(
    private userService: AuthService,
    private postService: PostService,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.getAllUser();
    this.getAllPosts();
    this.getAllMessages();
  }

  // Récupérer tous les utilisateurs
  getAllUser(): void {
    this.userService.getAllUsers().subscribe((data) => {
      console.log("Users reçus:", data);
      this.users = data;
    });
  }

  // Récupérer tous les messages
  getAllMessages(): void {
    this.chatService.getAllMessages().subscribe(
      (data) => {
        this.messages = data;
        console.log("Messages reçus:", data);  // Vérification des messages reçus
        if (this.users.length > 0) {
          console.log("ça marche !") // Vérification que les utilisateurs sont chargés
          this.generateMessageStatistics();  // Générer les statistiques des messages après réception des messages
        } else {
          console.log("Les utilisateurs ne sont pas encore chargés");
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    );
  }

  // Récupérer tous les posts
  getAllPosts(): void {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data;
      this.generatePostStatistics();  // Générer les statistiques après avoir récupéré les posts
    });
  }

  // Fonction pour générer les statistiques de posts
  generatePostStatistics(): void {
    // Comptabiliser les posts par utilisateur
    const postCountByUser = this.users.map(user => {
      return {
        user: user.pseudonym,  // Vérifier que 'pseudonym' est bien la clé pour l'affichage du nom
        postCount: this.posts.filter(post => post.author._id === user._id).length
      };
    });

    // Préparer les labels (utilisateurs) et les données (nombre de posts)
    const labels = postCountByUser.map(stat => stat.user);
    const data = postCountByUser.map(stat => stat.postCount);

    // Créer le graphique avec ces données
    this.createPostChart(labels, data);
  }

  // Fonction pour générer les statistiques des messages
  generateMessageStatistics(): void {
    console.log("Utilisateurs:", this.users); // Vérifier les utilisateurs
    console.log("Messages:", this.messages); // Vérifier les messages
  
    const messageCountByUser = this.users.map(user => {
      const count = this.messages.filter(message => message.sender === user.pseudonym).length;
      console.log(`Utilisateur: ${user.pseudonym}, Nombre de messages: ${count}`);
      return {
        user: user.pseudonym,
        messageCount: count
      };
    });
  
    const labels = messageCountByUser.map(stat => stat.user);
    const data = messageCountByUser.map(stat => stat.messageCount);
    console.log("Labels:", labels); // Vérifier les labels
    console.log("Data:", data); // Vérifier les données
  
    this.createMessageChart(labels, data);
  }
  


  // Fonction pour créer le graphique des posts avec Chart.js
  createPostChart(labels: string[], data: number[]): void {
    const canvasElement = document.getElementById('postChart') as HTMLCanvasElement;

    if (canvasElement) {
      new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nombre de Posts par Utilisateur',
            data: data,
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Statistiques des Posts par Utilisateur'
            }
          }
        }
      });
    } else {
      console.error("L'élément Canvas n'a pas été trouvé pour le graphique des posts.");
    }
  }
  // Fonction pour créer le graphique des messages avec Chart.js
  // Fonction pour créer le graphique des messages
  createMessageChart(labels: string[], data: number[]): void {
    const canvasElement = document.getElementById('messageChart') as HTMLCanvasElement;  // Canvas pour les messages
    if (canvasElement) {
      new Chart(canvasElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nombre de Messages par Utilisateur',
            data: data,
            backgroundColor: '#FF7043',
            borderColor: '#D32F2F',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Statistiques des Messages par Utilisateur'
            }
          }
        }
      });
    } else {
      console.error("L'élément Canvas n'a pas été trouvé pour le graphique des messages.");
    }
  }
}
