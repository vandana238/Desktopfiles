import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"
import { UserService } from '../services/user.service'
import { interval } from "rxjs";

const apiUrl = environment.hostURL
// const apiUrl = 'https://agent-portal-jnj-api.azurewebsites.net/v1/'
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
  public permission
  isLoggedin = false
  // isTabActive=true
  requestSource = interval(2500);

  role
  constructor(private http: HttpClient,private service :UserService) {
    // event.getTabStatus()
    if(this.service.decryptData()){
      this.role = this.service.decryptData().role
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error("error", error);
      return of(result as T);
    };
  }
  getAuthToken() {
    var token =this.service.decryptData().token
    return token
  }
  getUserList(id) {
    return this.http.get(`${apiUrl}bot/getrequests/` + id)
      .pipe(
        tap(group => console.log('')),
        catchError(this.handleError('groupList', []))
      );
  }

  check() {
    return this.http.get(`${apiUrl}check`)
      .pipe(
        tap(group => console.log('')),
        catchError(this.handleError('groupList', []))
      );
  }

  getAgentList() {
    return this.http.get(`${apiUrl}getusers`)
      .pipe(
        // tap(group => console.log('fetched getAgentList')),
        catchError(this.handleError('getAgentList', []))
      );
  }
  getConversation(id) {
    // console.log(id)
    return this.http.get(`${apiUrl}conversation/` + id)
      .pipe(
        // tap(group => console.log('convos')),
        catchError(this.handleError('getAgentList', []))
      );
  }

  updateStatus(data) {
    // const url = ${apiUrl}docs/${id}`;
    //console.log("post data", data)
    return this.http.post(apiUrl + "agentstatus/update", data)
  }


  sendMessage(data) {
    // const url = ${apiUrl}docs/${id}`;
    //console.log("post data", data)
    return this.http.post(apiUrl + "agent/sendMessage", data)
  }
  endchat(data) {
    //console.log("post data", data)
    return this.http.post(apiUrl + "agent/endchat", data)
  }

  createAgent(data) {
    //console.log("post data", data)
    return this.http.post(apiUrl + "agentstatus/create", data)
  }


  accept(data) {
    //console.log("post data", data)
    return this.http.post(apiUrl + "agent/accept", data)
  }

  login(data) {

    return this.http.post(apiUrl + "login", data)
  }

  register(data) {

    return this.http.post(apiUrl + "register", data)
  }
  removeUser(id) {
    return this.http.get(`${apiUrl}remove/` + id)
      .pipe(
        // tap(group => console.log('fetched getAgentList')),
        catchError(this.handleError('getAgentList', []))
      );
  }


  generatePassword() {
    return this.http.get(`${apiUrl}getpassword`)
      .pipe(
        // tap(group => console.log('fetched getAgentList')),
        catchError(this.handleError('getAgentList', []))
      );
  }

  resetPassword(data) {

    return this.http.post(apiUrl + "resetpassword", data)
  }

  changePassword(data) {
    return this.http.post(apiUrl + "changepassword", data)
  }

  updateConvoStatus(data) {
    return this.http.post(apiUrl + "convo/update/status", data)
  }

  showNotification(title, content) {
   
    console.log(Notification.permission)
    if (!("Notification" in window)) {
      alert("Desktop notifications is not supported by this browser. Try another.");
      return;
    } else if (Notification.permission === "granted") {
      var myNotification = new Notification(title, {
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8jQTTENFBfkU2rF3uNp87T-1ztULwO7Lphw&usqp=CAU",
        body: content
      });
      myNotification.onclick = function () {
        window.open('', 'liveagent').focus();
      };

    } else if (Notification.permission == 'default' || Notification.permission == 'denied') {
      Notification.requestPermission(function (userPermission) {
        if (userPermission === "granted") {
          var myNotification = new Notification(title, {
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8jQTTENFBfkU2rF3uNp87T-1ztULwO7Lphw&usqp=CAU",
            body: content
          });
          myNotification.onclick = function () {
            window.open('', 'liveagent').focus();
          };
        }
      });
    }
  }

}
// export declare type Permission = 'denied' | 'granted' | 'default'
// export interface PushNotification{
//   body?: String
// }