import { Routes } from '@angular/router';

export const routes: Routes = [

  {path:'', pathMatch:'full', redirectTo:'login'},
  {path:'login', loadChildren: () => import('./router/router/router-routing.module').then(m => m.RouterRoutingModule)}
];
