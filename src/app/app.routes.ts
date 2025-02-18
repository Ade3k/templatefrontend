import { Routes } from '@angular/router';

// Importation des composants associés aux différentes pages de l'application.
import { LoginComponent } from './components/login/login.component'; // Page de connexion.
import { SignupComponent } from './components/signup/signup.component'; // Page d'inscription.
import { HomeComponent } from './components/home/home.component'; // Page d'accueil après connexion.
import { AccueilComponent } from './components/accueil/accueil.component'; // Page principale avec des informations d'accueil.
import { MessagingComponent } from './components/messaging/messaging.component'; // Page pour le système de messagerie.
import { AuthGuard } from './services/authGard/AuthGuard'; // Service pour d'authentification.
import { AdminComponent } from './components/admin/admin.component'; // Page dédiée à l'admin.
import { PostsadminComponent } from './components/postsadmin/postsadmin.component';
import { UsersadminComponent } from './components/usersadmin/usersadmin.component';
import { MessagingadminComponent } from './components/messagingadmin/messagingadmin.component';
import { MessagingGroupeComponent } from './components/messaging-groupe/messaging-groupe.component';
import { StatistiquesadminComponent } from './components/statistiquesadmin/statistiquesadmin.component';

// Définition des routes de l'application.
export const routes: Routes = [
  {path:'usersadmin', component:UsersadminComponent},
  { path: 'login', component: LoginComponent }, // Route pour la page de connexion accessible via '/login'.
  // `pathMatch: 'full'` signifie que la route doit correspondre exactement à '/' pour effectuer la redirection.
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirection de la racine de l'application ('/') vers '/home', pour garantir une page par défaut à afficher.
  // Route pour la page d'inscription accessible via '/signup'.
  { path: 'signup', component: SignupComponent },
  { path:'postsadmin', component:PostsadminComponent},
  {path:'onMessagingPrivateClick', component:MessagingadminComponent},
  {path:'messagingGroupe', component:MessagingGroupeComponent},
  // Route pour la page d'accueil protégée par un AuthGuard.
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  } /* Le canActivate: [AuthGuard] empêche l'accès aux routes 
  pour les utilisateurs non authentifiés. Ce service vérifie si l'utilisateur est autorisé à accéder à une page. */,
  { path: 'accueil', component: AccueilComponent, canActivate: [AuthGuard] }, // Route pour la page d'accueil principale protégée également par AuthGuard.
  {
    path: 'messaging',
    component: MessagingComponent,
    canActivate: [AuthGuard],
  }, // Route pour la messagerie interne, protégée par AuthGuard.
  { path: 'admin', component: AdminComponent }, // Route pour la page de l'admin.
  {path:'statistiquesadmin', component:StatistiquesadminComponent}
];
