import { NotificationService } from './../notification.service';
import { LoaderService } from './../loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from 'src/app/firebase.service';
import { Image, User } from '../user';
import * as _ from 'lodash'

@Component({
    selector: 'app-new-post',
    templateUrl: './new-post.component.html',
    styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
    imageForm: FormGroup = new FormGroup({});
    imageObject: any
    isSubmitted: boolean = false;
    userEmail: string = '';
    users: Array<User> = new Array;
    imgSrc: string = 'assets/file-upload-image-icon-115632290507ftgixivqp.png';
    constructor(private angularFireStorage: AngularFireStorage,
        private matDialogRef: MatDialogRef<NewPostComponent>,
        private _firebaseService: FirebaseService,
        public _loader: LoaderService,
        private _notificationService: NotificationService) { }

    ngOnInit(): void {
        this.imageForm = new FormGroup({
            imgUrl: new FormControl('', [Validators.required]),
            caption: new FormControl(''),
            id: new FormControl(this.getRandomNumberBetween(1, 10000000)),
            name: new FormControl(''),
            date: new FormControl('')
        })
        setTimeout(() => {
            this._firebaseService.getUser().subscribe(
                (Response) => {
                    this.users = _.values(Response)
                }
            )
        }, 3000);

    }
    getRandomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    onPost(formValue: Image): void {
        this.isSubmitted = true;
        if (this.imageForm.invalid) {
            this.imageForm.markAllAsTouched();
            return;
        }
        this._firebaseService.isLoginUser().then(
            (user) => {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].email === user.email) {
                        formValue['name'] = this.users[i].name;
                        formValue['date'] = this.getDate();
                    }
                }
                // formValue['name'] = user.email.substring(0,user.email.lastIndexOf('@'))
            });
        this.uploadImageToDb(formValue)
    }

    //called when the image is selected forom user
    updateImage(imageObject: any): void {
        if (imageObject.target.files && imageObject.target.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = (event: any) => this.imgSrc = event.target.result;
            fileReader.readAsDataURL(imageObject.target.files[0]);
            this.imageObject = imageObject.target.files[0]
        }
        else {
            this.imgSrc = 'assets/file-upload-image-icon-115632290507ftgixivqp.png';
            this.imageObject = null;
        }

    }

    getDate(): string {
        let today = new Date().toLocaleDateString()
        return today;
    }

    clearValidators(): void {
        this.imageForm.clearValidators();
        this.imageForm.reset();
    }

    //to upload image to firebase storage
    uploadImageToDb(formValue: Image) {
        this._loader.loading.next(true);
        var filePath: string = `images/${this.imageObject.name}.${this.imageForm.get('id')?.value}`
        const fileRef = this.angularFireStorage.ref(filePath);
        this._firebaseService.uploadImage(filePath, this.imageObject).snapshotChanges().pipe(
            finalize(() => {
                fileRef.getDownloadURL().subscribe((url) => {
                    formValue['imgUrl'] = url;
                    this._firebaseService.uploadImageDetails(formValue).subscribe(
                        (Response) => {
                            this._loader.loading.next(false)
                            this._notificationService.success(': : Posted');
                            this.matDialogRef.close();
                            this.clearValidators();
                        },
                        (Error) => {
                            this._notificationService.error('Something Went Wrong')
                        }
                    )
                })
            })
        ).subscribe(
            (Response) => this._notificationService.processing('...Processing'),
            (error) => this._notificationService.error("Something Went Wrong")
        )
    }
}
