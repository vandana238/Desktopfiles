import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {AuthService} from "../services/auth.service"

@Injectable({
  providedIn: 'root'
})
export class QuickresponseService {

  constructor(private http: HttpClient,private interceptor:AuthService) {}


   getQuickresponses() {
    return this.http.get(`${environment.hostURL}api/quickresponse`)
      .pipe(
      
        catchError(this.interceptor.handleError('getAgentList', []))

      );
  }

  createQuickResponse(data) {
    return this.http.post(environment.hostURL + "api/quickresponse/create", data) .pipe(
      
      catchError(this.interceptor.handleError('getAgentList', []))

    );
  }

  deleteQuickResponse(id) {
    return this.http.post(environment.hostURL + "api/quickresponse/remove", {id:id}) .pipe(
      
      catchError(this.interceptor.handleError('getAgentList', []))

    );
  }


  updateQuickResponse(data){
    return this.http.post(environment.hostURL + "api/quickresponse/update", data) .pipe(
      
      catchError(this.interceptor.handleError('getAgentList', []))

    );

    
  }
  }
