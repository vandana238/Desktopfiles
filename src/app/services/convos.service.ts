import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"
import {AuthService} from "../services/auth.service"

const apiUrl = environment.hostURL
// const apiUrl = 'https://agent-portal-jnj-api.azurewebsites.net/v1/'
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ConvosService {
  constructor(private http: HttpClient,private interceptor:AuthService) {
  }

  getUserList(id,status) {
    // console.log(`${apiUrl}api/convos/bot/getrequests/` + id+`/`+status)
    return this.http.get(`${apiUrl}api/convos/bot/getrequests/` + id+`/`+status)
      .pipe(
        tap(group => {}),
        catchError(this.interceptor.handleError('getAgentList', []))

      );
  }
  getCompleted(status) {
    // console.log(`${apiUrl}api/convos/bot/getrequest/all`+status)
    return this.http.get(`${apiUrl}api/convos/bot/getrequest/all/`+status)
      .pipe(
        tap(group => {}),
        catchError(this.interceptor.handleError('getCompleted', []))

      );
  }

  


  endchat(data) {
    //console.log("post data", data)
    return this.http.post(apiUrl + "api/convos/endchat", data) .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('getAgentList', []))

    );
  }


  accept(data) {
    //console.log("post data", data)
    return this.http.post(apiUrl + "api/convos/accept", data) .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('getAgentList', []))

    );
  }
  updateConvoStatus(data){
    return this.http.post(apiUrl + "api/convos/update/status", data) .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('getAgentList', []))

    );
  }

  getOngoingList(id) {
    // console.log(`${apiUrl}api/convos/bot/ongoing/requests/` + id+`/Accepted`)
    return this.http.get(`${apiUrl}api/convos/bot/ongoing/requests/` + id+`/Accepted`)
      .pipe(
        tap(group => {}),
        catchError(this.interceptor.handleError('', []))

      );
  }

  searchConvo(data,id) {
    data.id=id
    console.log(id)
    return this.http.post(`${apiUrl}api/convos/search`,data)
      .pipe(
        tap(group => {}),
        catchError(this.interceptor.handleError('', []))

      );
  }
  getTranscript(id){
    return this.http.get(`${apiUrl}api/convos/bot/message/` + id)
    .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('', []))

    );
  }
  getUserStatus(id){
    return this.http.get(`${apiUrl}api/convos/status/` + id)
    .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('', []))

    );
  }

  getConvosById(id){
    return this.http.get(`${apiUrl}api/convos/bot/getconvo/`+id)
    .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('', []))

    );
  }
  getConvosCount(){
    return this.http.get(`${apiUrl}api/convos/bot/getconvo/agent/count`)
    .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('', []))

    );
  }
  transferConvo(data){
    return this.http.post(apiUrl + "api/convos/transfer", data) .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('', []))

    );
  }

  transferAccept(data){
    return this.http.post(apiUrl + "api/convos/transfer/accept", data) .pipe(
      tap(group => {}),
      catchError(this.interceptor.handleError('', []))

    );
  }
}
