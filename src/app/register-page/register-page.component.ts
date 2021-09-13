import { NotificationService } from './../notification.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
    registerForm: FormGroup = new FormGroup({})

    constructor(private _firebaseService: FirebaseService,
        private _router: Router,
        private _notification: NotificationService) { }

    ngOnInit(): void {
        this.registerForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            age: new FormControl('', [Validators.required]),
            phoneNumber: new FormControl('', [Validators.required, Validators.pattern("[7-9]{1}[0-9]{9}")]),
            email: new FormControl('', [Validators.required, Validators.pattern("[a-z 0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$")]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
        })
    }

    resetForm() {
        this.registerForm.reset();
        this._firebaseService.logoutUser().then((Res) => {
            //the registered user will logsout , and then login
        })
        this._router.navigate(['/login'])
        this._notification.success('::Registration Successful => Please Login')
    }

    onRegister() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return
        }
        this._firebaseService.storeUserDetails(this.registerForm.value).subscribe(
            (Response) => console.log(Response),
            (error) => console.log(error)
        )

        this._firebaseService.creatUser(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value).then(Response => {
            console.log(Response);
        }).catch(error => {
            this._notification.error('error.message')

        })
        this.resetForm();
    }
}
