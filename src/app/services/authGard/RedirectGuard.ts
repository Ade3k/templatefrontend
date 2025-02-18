import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../authService/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getUser().pipe(
      // Assurez-vous que la méthode getUser retourne un Observable
      map((user) => {
        if (user?.isAdmin) {
          this.router.navigate(['/statistiquesadmin']);
          return false; // Empêche la navigation vers la route actuelle
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      })
    );
  }
}
