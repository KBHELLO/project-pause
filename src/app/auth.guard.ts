import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor() {
  }

  canActivate(): boolean {
    return !!(localStorage.getItem('ci') && localStorage.getItem('cm'));

  }

}
