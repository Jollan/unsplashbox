import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  ngOnInit(): void {
    localStorage.removeItem('userData');
    setTimeout(() => {
      location.href = '/authen';
    }, 500);
  }
}
