import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  readonly authService = inject(AuthService);

  ngOnInit() {
   this.authService.userData = JSON.parse(localStorage.getItem('userData')!);
  }
  
  logout() {
    this.authService.userData = null;
    localStorage.removeItem('userData');
  }
}
