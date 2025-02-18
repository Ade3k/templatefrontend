import { Component } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usersadmin',
  imports: [CommonModule, FormsModule],
  templateUrl: './usersadmin.component.html',
  styleUrl: './usersadmin.component.css'
})
export class UsersadminComponent {
  
  users: any[] = [];

  constructor(private userService: AuthService) { }

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser(): void {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        // Si l'utilisateur est supprimé avec succès, on met à jour la liste des utilisateurs
        this.getAllUser();
        console.log("Utilisateur supprimé avec succès !");
      },
      error: (err) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
      }
    });
  }
}

