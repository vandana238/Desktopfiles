import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service'

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  constructor(private router: Router,private service:UserService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable <boolean> | Promise<boolean> | boolean {
    // return true if you want to navigate, otherwise return false
    if(this.service.decryptData())
    var role= this.service.decryptData().role
    // console.log(route,role)
    // if(route.data.role==role)
    return true
    // else
    // return false
  }
}
