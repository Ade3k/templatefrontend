import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../authService/auth.service';

@Injectable({
  providedIn: 'root', // Cette ligne permet d'injecter le service AuthGuard dans l'ensemble de l'application.
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // La méthode canActivate est appelée avant qu'une route protégée ne soit activée.
  // Elle renvoie un observable qui déterminera si l'accès à la route est autorisé ou non.
  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
