import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ce service est disponible dans toute l'application.
})
export class PostService {

  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) { }

  // Méthode pour créer une nouvelle publication
  createPost(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  getAllPosts(): Observable<any> {
    return this.http.post(`${this.apiUrl}/getallposts`, {});
  }

  // Méthode pour supprimer une publication en fonction de son identifiant
  deletePost(postId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deletethis`, {postId});
  }

  // Méthode pour récupérer toutes les publications d'un utilisateur spécifique
  getUserPosts(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Méthode pour récupérer les publications d'un utilisateur spécifique (fonctionne de manière similaire à getUserPosts)
  loadPostsForFriendsUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Méthode pour récupérer les publications de tous les amis de l'utilisateur
  loadPostsForAllFriends(userIds: string[]): Observable<any[]> {
    const postRequests = userIds.map((userId) =>
      this.loadPostsForFriendsUser(userId)
    );
    return forkJoin(postRequests).pipe(
      map((postsArray) => {
        const allPosts = postsArray.flat();
        allPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return allPosts;
      })
    );
  }

  // Méthode pour ajouter un commentaire à une publication
  addComment(postId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comment`, {
      PostId: postId,
      content,
    });
  }
}
