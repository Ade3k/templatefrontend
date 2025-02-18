import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/authService/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrl: './signup.component.css',
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastr: ToastrService) {}

  // Propriétés liées aux champs du formulaire d'inscription
  selectedFileName: string = '';
  pseudonym = '';
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  age: number | null = null;
  gender = '';
  bio = '';
  preferences: string[] = [];
  file: File | null = null;
  availablePreferences: string[] = [
    'Bicyclette',
    'Demi-course',
    'Draisienne',
    'Rollers',
    'Skateboard',
    'Tricycle',
    'Trottinette',
    'VTT',
  ];

  // Méthode pour naviguer vers la page de login après la création du compte
  navigateToLogin() {
    this.router.navigate(['login']);
  }

  // Méthode qui est appelée lors de la soumission du formulaire
  onSubmit() {
    
    const formData = new FormData(); // Création d'un objet FormData pour envoyer les données du formulaire

    // Ajout des données du formulaire dans l'objet FormData
    formData.append('pseudonym', this.pseudonym);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('age', this.age ? this.age.toString() : '');
    formData.append('gender', this.gender);
    formData.append('bio', this.bio);
    formData.append('preferences', JSON.stringify(this.preferences));

    if (this.file) {
      formData.append('photo', this.file);
    }

    // Appel du service pour créer un nouvel utilisateur avec les données du formulaire
    this.authService.createUser(formData).subscribe({
      next: (response) => {
        console.log('Utilisateur créé avec succès', response);
        this.toastr.success('Utilisateur créé avec succès', 'Success', {
          timeOut: 2000,
          positionClass: 'toast-top-right', 
          toastClass: 'custom-toast'
        });
        this.navigateToLogin();
      },
      error: (error) => {
        console.error('Erreur lors de la création de l’utilisateur', error);
      },
      complete: () => {
        console.log('Requête terminée');
      },
    });
  }

  // Méthode pour gérer la sélection d'une photo de profil
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      console.log('Fichier sélectionné :', this.file);
    }
  }

  // Méthode pour gérer les changements d'état des cases à cocher (préférences)
  onCheckboxChange(event: any, option: string) {
    if (event.target.checked) {
      this.preferences.push(option);
    } else {
      this.preferences = this.preferences.filter((pref) => pref !== option); // Enlève l'option des préférences si la case est décochée
    }
  }
}
