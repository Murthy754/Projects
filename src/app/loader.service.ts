import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public loading : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public posting : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor() { }
}
