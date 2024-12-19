import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { AvatarComponent } from './shared/components/avatar/avatar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AvatarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  mobileMenu = signal(false);
  constructor(public auth: AuthService) {}
}
