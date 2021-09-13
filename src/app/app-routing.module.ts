import { PostsComponent } from './posts/posts.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorized = () => redirectUnauthorizedTo((['/login']))
const redirectLogged = () => redirectLoggedInTo((['/posts']))

const routes: Routes = [
    { path: '', redirectTo: 'posts', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLogged } },
    { path: 'register', component: RegisterPageComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLogged } },
    { path: 'posts', component: PostsComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorized } }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }