import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { authGuard } from './guards/auth.guard';
import { QueueDisplayComponent } from './components/queue-display/queue-display.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent,  },

  { path: 'home', component: HomeComponent },

  { path: 'queue-display', component: QueueDisplayComponent},

  { path: '**', redirectTo: 'login' }
];
