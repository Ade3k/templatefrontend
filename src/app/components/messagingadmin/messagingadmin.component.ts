import { Component } from '@angular/core';
import { ChatService } from '../../services/chatService/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messagingadmin',
  imports: [CommonModule, FormsModule],
  templateUrl: './messagingadmin.component.html',
  styleUrl: './messagingadmin.component.css'
})
export class MessagingadminComponent {
  messages: any[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.getAllMessages();
  }

  getAllMessages(): void {
    console.log("j'ai été appelé");
    this.chatService.getAllMessages().subscribe(
      (data) => {
        this.messages = data;
        console.log("Messages reçus :", data);
      },
      (error) => {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    );
  }

  deleteMessage(messageId: string): void {
    this.chatService.deleteMessage(messageId).subscribe({
      next: (response) => {
        this.getAllMessages();
        console.log("Utilisateur supprimé avec succès !");
      },
      error: (err) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
      }
    });
  }

}

