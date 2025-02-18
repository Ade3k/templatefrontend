import { Component } from '@angular/core';
import { PostService } from '../../services/postService/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-postsadmin',
  imports: [CommonModule, FormsModule],
  templateUrl: './postsadmin.component.html',
  styleUrl: './postsadmin.component.css'
})

export class PostsadminComponent {

  posts: any[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data;
      console.log("mes posts", this.posts);
    });
  }

  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe({
      next: (response) => {
        this.getAllPosts();
        console.log("Utilisateur supprimé avec succès !");
      },
      error: (err) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
      }
    });
  }
}
