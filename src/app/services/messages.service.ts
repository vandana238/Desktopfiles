import { Injectable } from "@angular/core";
import { of, throwError } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthService } from "../services/auth.service";

const apiUrl = environment.hostURL + "/api/convos/";
// const apiUrl = 'https://agent-portal-jnj-api.azurewebsites.net/v1/'
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class MessagesService {
  constructor(private http: HttpClient, private interceptor: AuthService) {}

  sendMessage(data) {
    return this.http.post(apiUrl + "to/bot", data);
  }
  getMessageById(id) {
    return this.http
      .get(`${environment.hostURL}api/convos/bot/message/` + id)
      .pipe(catchError(this.interceptor.handleError("getAgentList", [])));
  }
    
  getSubToken() {

    return this.http.get(environment.hostURL + "api/users/subscriber/token")
      .pipe(
        tap(group => console.log('add user')),
        catchError(this.interceptor.handleError('', []))
      );
  }
}
