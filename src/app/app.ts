import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvestmentsListComponent } from './components/investments-list/investments-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InvestmentsListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
