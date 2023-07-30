import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user!: User;
  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    setTimeout(() => {
      this.user = this.authService.getUser();
    console.log(this.user);

    }, 800)
  }

  logout(){
    this.authService.logout();
  }

}
