import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit  {
  constructor(private service: AuthService) {}

  ngOnInit() {
    this.getUserDate();
  }
  getUserDate() {
    this.service.getRole().subscribe((res) => {
      this.service.user.next(res);
    })
  }
}
