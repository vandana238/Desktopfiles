import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {AuthService} from "../services/auth.service"

@Injectable({
  providedIn: 'root'
})
export class RemedyService {

  constructor(private http: HttpClient,private interceptor:AuthService) { }
  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error("error", error);

  //     return of(result as T);
  //   };
  // }

  getTicketInfo(id) {
    return this.http.get(`${environment.hostURL}api/remedy/getincident/` + id)
      .pipe(
        catchError(this.interceptor.handleError('getAgentList', []))
      );
  }

  updateTicket(data) {
    return this.http.post(environment.hostURL + "api/remedy/update", data)
  }
  closeTicket(data) {
    return this.http.post(environment.hostURL + "api/remedy/close", data)
  }

  getcategories(){    
    return this.http.get(environment.hostURL + "api/remedy/getcategories")
  }
  getresolution(){
    return this.http.get(environment.hostURL + "api/remedy/getresolution")
  }

  getcause(){
    return this.http.get(environment.hostURL + "api/remedy/getcause")
  }
  getpriorities(){
    return this.http.get(environment.hostURL + "api/remedy/getpriority")
  }
  getcasetypes(){
    return this.http.get(environment.hostURL + "api/remedy/getcasetype")
  }
  getProjectids(){
    return this.http.get(environment.hostURL + "api/remedy/getprojectid")
  }

  getGroups(){
    return this.http.get(environment.hostURL + "api/remedy/getgroups")
  }
  getMembers(id){
    return this.http.get(environment.hostURL + "api/remedy/getmembers/"+id)
  }
  getRMError(){
    return this.http.get(environment.hostURL + "api/remedy/getrmerror")
  }
  getRMSolution(rmerror){
    return this.http.post(environment.hostURL + "api/remedy/getrmsolution/",{error:rmerror})
  }
  
  getEndUserResponse(resolution){
    return this.http.post(environment.hostURL + "api/remedy/getenduserresponse/",{resolution:resolution})
  }
}
