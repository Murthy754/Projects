import { Injectable } from '@angular/core';
import {MatSnackBar , MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public _snackBar : MatSnackBar) { }

  matSnackBarConfig : MatSnackBarConfig = {
    duration : 2000,
    horizontalPosition : 'right',
    verticalPosition : 'top'
  }

  success(message : string){
    this.matSnackBarConfig['panelClass'] = ['notification' , 'success']
    this._snackBar.open(message, '' , this.matSnackBarConfig);
  }

  error(message : string) {
    this.matSnackBarConfig['panelClass'] = ['notification' , 'error']
    this._snackBar.open(message, '' , this.matSnackBarConfig);
  }

  processing(message : string) {
    this.matSnackBarConfig['panelClass'] = ['notification' , 'processing']
    this._snackBar.open(message, '' , this.matSnackBarConfig);
  }

}
