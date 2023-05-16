import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SseserviceService } from "./sseservice.service"
import { environment } from "../../environments/environment"
import { AuthService } from "../services/auth.service"

import { Observable } from "rxjs";
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public secretKey
  isLoggedin = false
  constructor(private http: HttpClient, private event: SseserviceService, private interceptor: AuthService) {
    // event.getTabStatus()


    if (localStorage.getItem('profile'))
      // this.role = JSON.parse(localStorage.getItem('profile')).role
      this.role = this.decryptData().role
  }
  role
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error("error",error);

  //     return of(result as T);
  //   };
  // }


  getAgentList() {
    return this.http.get(`${environment.hostURL}api/users`)
      .pipe(

        catchError(this.interceptor.handleError('', []))
      );
  }


  updateStatus(data) {
    return this.http.put(environment.hostURL + "api/users/status", data)
      .pipe(

        catchError(this.interceptor.handleError('', []))
      );
  }
  userStatus() {
    return this.http.get(environment.hostURL + "api/users/status")
      .pipe(

        catchError(this.interceptor.handleError('', []))
      );
  }

  updateAllagentStatus(data) {
    return this.http.put(environment.hostURL + "api/users/status/all", data)
      .pipe(

        catchError(this.interceptor.handleError('', []))
      );
  }
  login(data) {

    return this.http.post(environment.hostURL + "login", data)
    // .pipe(
    //   tap(group => console.log('remove user')),
    //   catchError(this.interceptor.handleError('', []))
    // );
  }

  register(data) {

    return this.http.post(environment.hostURL + "api/users/register", data)
      .pipe(
        tap(group => console.log('add user')),
        catchError(this.interceptor.handleError('', []))
      );
  }
  removeUser(id) {
    return this.http.delete(`${environment.hostURL}api/users/` + id)
      .pipe(
        tap(group => console.log('remove user')),
        catchError(this.interceptor.handleError('', []))
      );
  }


  getPortalStatus() {
    return this.http.get(`${environment.hostURL}api/portal/status`)
      .pipe(
        tap(group => console.log('portal status')),
        catchError(this.interceptor.handleError('getAgentList', []))
      );
  }

  updatePortalStatus(data) {
    return this.http.put(`${environment.hostURL}api/portal/status/update`, data)
      .pipe(
        tap(group => console.log('update status')),
        catchError(this.interceptor.handleError('getAgentList', []))
      );
  }

  generatePassword() {
    return this.http.get(`${environment.hostURL}api/users/password/generate`)
      .pipe(
        tap(group => console.log('generate password')),
        catchError(this.interceptor.handleError('getAgentList', []))
      );
  }

  resetPassword(data) {

    return this.http.post(environment.hostURL + "api/users/password/reset", data)
      .pipe(
        tap(group => console.log('password reset')),
        catchError(this.interceptor.handleError('getAgentList', []))
      );
  }

  changePassword(data) {
    return this.http.post(environment.hostURL + "api/users/password/change", data)
      .pipe(
        tap(group => console.log('password change')),
        catchError(this.interceptor.handleError('getAgentList', []))
      );
  }

  getSecretKey() {
    this.http.get(environment.hostURL + "secretkey").subscribe((res: any) => {
      this.secretKey = res.key
    })
  }


  encryptData(data: any) {
    // let encryptInfo = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(data),'secret_profile_key').toString());

    localStorage.setItem("profile", JSON.stringify(data))

  }
  decryptData() {
    try {
      if (localStorage.getItem("profile") == null)
        return undefined
      // var deData = CryptoJS.AES.decrypt(decodeURIComponent(localStorage.getItem("profile")),'secret_profile_key');
      let decryptedInfo = JSON.parse(localStorage.getItem("profile"));
      return decryptedInfo
    } catch (e) {
      console.log("clear from decrypt")

      localStorage.clear()
    }
  }



}
