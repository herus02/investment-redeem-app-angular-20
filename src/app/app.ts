import { Component } from '@angular/core';
import { InvestmentsListComponent } from './components/investments-list/investments-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
