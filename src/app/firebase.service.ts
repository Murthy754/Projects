import { User, Image } from './user';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireStorage } from '@angular/fire/storage';
import * as _ from 'lodash'

@Injectable({
    providedIn: 'root'
})
export class FirebaseService implements OnInit {
    isLogin: boolean = false;
    users: Array<User> = new Array
    constructor(private _http: HttpClient,
        private _angularFireAuth: AngularFireAuth,
        private angularFireStorage: AngularFireStorage) { }
    ngOnInit(): void {
        this.getUser().subscribe(
            (Response) => {
                this.users = _.values(Response)
            })
    }

    storeUserDetails(formValues: User): Observable<any> {
        return this._http.put(environment.databaseURL + '/Users/' + formValues.name + '.json', formValues)
    }

    creatUser(email: string, password: string): Promise<any> {
        return this._angularFireAuth.createUserWithEmailAndPassword(email, password);
    }

    loginUser(name: string, password: string): Promise<any> {
        return this._angularFireAuth.signInWithEmailAndPassword(name, password);
    }
    isLoginUser(): Promise<any> {
        return this._angularFireAuth.currentUser
    }
    logoutUser(): Promise<any> {
        return this._angularFireAuth.signOut()
    }

    uploadImage(filePath: string, imageObject: any) {
        return this.angularFireStorage.upload(filePath, imageObject)
    }

    uploadImageDetails(formValues: any): Observable<object> {
        return this._http.put(environment.databaseURL + '/Images/' + formValues.id + '.json', formValues)
    }

    getImages(): Observable<object> {
        return this._http.get(environment.databaseURL + '/Images.json')
    }
    getUser(): Observable<any> {
        return this._http.get(environment.databaseURL + '/Users.json')
    }

}
