import { Routes } from '@angular/router';
import { InvestmentsListComponent } from './components/investments-list/investments-list.component';
import { RedeemComponent } from './components/redeem/redeem.component';

export const routes: Routes = [
  { path: '', component: InvestmentsListComponent },
  { path: 'redeem/:nome', component: RedeemComponent }
];
