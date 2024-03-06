import { Component } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { HeaderComponent } from './header/header.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule, ViewComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'expireapp';
}
