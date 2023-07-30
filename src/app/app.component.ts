import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    initFlowbite();
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
