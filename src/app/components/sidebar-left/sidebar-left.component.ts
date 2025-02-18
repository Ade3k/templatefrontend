import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.css',
})
export class SidebarLeftComponent {
  @Input() user!: any; // Propriété qui permet de recevoir un utilisateur de son composant parent. "user" est une donnée d'entrée.
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}
  private userSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.loadUser().then(() => {
      this.userSubscription = this.authService.selectedUser$.subscribe(
        (user) => {
          console.log('this is the user baby', user);
          if (user) {
            this.user = user;
          }
        }
      );
    });
  }
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Méthode privée pour charger les informations de l'utilisateur connecté via AuthService.
  private loadUser(): Promise<void> {
    return firstValueFrom(this.authService.getUser())
      .then((data) => {
        this.user = data;
      })
      .catch(() => {
        this.errorMessage =
          'Erreur lors du chargement des informations utilisateur.';
      });
  }
}
