import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../page/home/home.component';
import { LoginComponent } from '../../page/login/login.component';
import { authGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'home', component: HomeComponent, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouterRoutingModule { }
