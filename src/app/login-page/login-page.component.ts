import { NotificationService } from './../notification.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {FirebaseService} from 'src/app/firebase.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
    loginForm: FormGroup = new FormGroup({})

    constructor(private _firebaseSerice : FirebaseService,
                private _router : Router,
                private _notification : NotificationService) { }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required , Validators.pattern("[a-z 0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
        });
    }

    onLoginSubmit(){
        if(this.loginForm.invalid){
            this.loginForm.markAllAsTouched();
            return;
        }
        this._firebaseSerice.loginUser(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).
        then(
            Response => {
            this._notification.success('::Successfully Logged In');
            this._router.navigate(['/posts']);
            }
        ).catch(
            error =>{
            this._notification.error(error.message);
            }
            )
    }

    registerNewUser(){
        this._router.navigate(['/register'])
      }
}
