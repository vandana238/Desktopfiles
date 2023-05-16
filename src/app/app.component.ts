import { Component, AfterViewInit, NgZone } from "@angular/core";
import { UserService } from "./services/user.service";
import { Title } from "@angular/platform-browser";
import { Routes, Router, ActivatedRoute } from "@angular/router"; // import {ApiserviceService}
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  private timeout;
  isCollapsed = false;

  constructor(
  
    public service: UserService,
    private route: Router,
    public _zone: NgZone
  ) {
    this.islogin();
    if (this.service.isLoggedin) {
      this.route.navigateByUrl("/home");
    }


  }
  
  islogin() {
    var a = this.service.decryptData();
    if (a) {
      // this.service.isLoggedin=true
      this.service.role = this.service.decryptData().role;
    }
  }
  select(nav) {
    this.route.navigateByUrl("/" + nav);
  }
  collapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
