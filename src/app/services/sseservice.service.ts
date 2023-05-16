import { Injectable, NgZone, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessagesService } from "../services/messages.service"
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { webSocket } from 'rxjs/webSocket';
import { compileComponentFromRender2 } from '@angular/compiler/src/render3/view/compiler';
@Injectable({
  providedIn: 'root',
})
export class SseserviceService {
  sseloaded: boolean;
  constructor(private _zone: NgZone, private userService: MessagesService) {
    this.sseloaded = false;
  }
  private evtSource = new EventSource(environment.hostURL + 'event/agent');
  // private wsslink =
  //   'wss://agentnotify.webpubsub.azure.com/client/hubs/agentnotify?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjQzNzE1NzIsImV4cCI6MTY2NDM3NTE3MiwiYXVkIjoiaHR0cHM6Ly9hZ2VudG5vdGlmeS53ZWJwdWJzdWIuYXp1cmUuY29tL2NsaWVudC9odWJzL2FnZW50bm90aWZ5In0.gmaedCABAqcophg9zdyRPSGFhipgPW5FIfi3vuO5Loo';



  public connect() {
    console.log('connecting');
    return new Observable((observer) => {
      let wsslink: any
      this.userService.getSubToken().subscribe((data:any)=>{
         console.log(data);
         wsslink= data.token
         const sub = webSocket(wsslink);

      sub.subscribe(
        (message) => observer.next(message),
        (error) => console.log(error),
        () => console.log('first')
      );
        })
     
    });
  }

  public getMessage(): Observable<any> {
    return new Observable((observer) => {
      // console.log(this.evtSource);
      // this._zone.run(() => {
      this.evtSource.addEventListener('event', function(evt: any) {
        const data = JSON.parse(evt.data);
        // console.log(evt.data);
        observer.next(data);
      });
    });
    // });
  }
  public disconnectEvent() {
    this.evtSource.removeEventListener('event', () => {
      // console.log("remove eventlistner");
    });
  }
  // public getTabStatus() {
  //   return new Observable(observer => {
  //     fromEvent(document, 'visibilitychange').subscribe((data: any) => {
  //       observer.next(data.target.hidden)
  //     });
  //   })
  // }
}
