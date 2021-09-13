import { NotificationService } from './../notification.service';
import { LoaderService } from './../loader.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { NewPostComponent } from '../new-post/new-post.component';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import * as _ from 'lodash'; 
import { Image } from '../user';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
    images: Array<Image> = new Array;
    constructor(private _router: Router,
        private _firebaseSerice: FirebaseService,
        private matDialog: MatDialog,
        private _loader: LoaderService,
        private _notification: NotificationService) { }

    ngOnInit(): void {
        this.getAllImages();

    }

    trackPosts(index: number, posts: Image) {
        return posts.id;
    }

    loginUser() {
        this._router.navigate(['/login'])
    }


    newPost() {
        const matDialogConfig = new MatDialogConfig();
        matDialogConfig.disableClose = true;
        matDialogConfig.width = "80% "
        this.matDialog.open(NewPostComponent, matDialogConfig).afterClosed().subscribe(() => {
            this.getAllImages()
        })
    }

    getAllImages() {
        this._firebaseSerice.getImages().subscribe(
            (Response) => {
                this.images = _.values(Response);
            },
            (Error) => this._notification.error('Something Went Wrong ' + Error.message)
        );
    }

    logoutUser() {
        this._firebaseSerice.logoutUser().
            then(
                Response => {
                    this._router.navigate(['/login']);
                    this._notification.success('::Logout Successful')
                }
            ).catch(
                error => this._notification.error(':: Something Went Wrong')
            )
    }

}
