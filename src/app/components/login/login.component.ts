import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html',
})

export class LoginComponent {

  constructor(private router: Router,
              private authService: AuthService,
              private toastr: ToastrService) {}

  username = '';
  password = '';
  email = '';
  showEmailField = false;  // Nouvelle variable pour contrôler l'affichage de l'email

  onLogin(): void {
    const loginData = { pseudonym: this.username, password: this.password };
    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Connexion réussie', response);
        this.router.navigate(['home']);
      },
      error: (error) => {
        this.toastr.error('Mot de passe ou email incorrect', 'Erreur', {
          timeOut: 1000
        });
        console.error('Erreur de connexion', error);
      },
      complete: () => console.log('Requête terminée')
    });
  }

  resetPassword() : void {
    this.authService.resetPassword(this.email).subscribe({
      next: (response) => {
        this.toastr.success('Mot de passe réinsialiser avec succès', 'Success', {
          timeOut: 2000,
        });
        this.showEmailField= false;
        this.email=''
      },
      error: (error) => {
        this.toastr.error('L\email que vous avez entré est invalide', 'Erreur', {
          timeOut: 1000
        });
      }
    })
  }

  navigateToSignup(): void {
    this.router.navigate(['signup']);
  }

  // Fonction pour activer l'affichage du champ email
  openModal(): void {
    this.showEmailField = !this.showEmailField;
  }

}
