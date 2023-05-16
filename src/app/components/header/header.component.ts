import { Component, OnInit } from "@angular/core";
import { Routes, Router } from "@angular/router";
import { DateagoPipe } from "../../pipes/dateago.pipe";
import { ApiserviceService } from "../../services/apiservice.service";
import { UserService } from "../../services/user.service";
import { SseserviceService } from "../../services/sseservice.service";
import { Observable } from "rxjs";
import { ChatComponent} from '../chat/chat.component'
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.less"],
})
export class HeaderComponent implements OnInit {
  constructor(
    private service: UserService,
    private route: Router,
    private sse: SseserviceService,
    public apiService:ChatComponent
  ) {}
  headerText = "";
  myprofile;
  switchValue = true;
  ngOnInit(): void {
    this.service.getPortalStatus().subscribe((res: any) => {
      // console.log(res)
      this.switchValue = res.status;
    });
    this.myprofile = this.service.decryptData();
    // this.myprofile = {
    //   name: JSON.parse(localStorage.getItem('profile')).fullName,
    //   userId: JSON.parse(localStorage.getItem('profile')).userid,
    //   email: JSON.parse(localStorage.getItem('profile')).email,
    //   currentStatus: JSON.parse(localStorage.getItem('profile')).status,
    //   lastActive: Date.now(),
    //   role: JSON.parse(localStorage.getItem('profile')).role,
    // }
    console.log(this.myprofile)

    if (this.route.url == "/home") this.headerText = "Conversations";
    if (this.route.url == "/users") this.headerText = "User Management";

    if (this.route.url == "/profile") this.headerText = "User Profile";

    if (this.route.url == "/quick-responses")
      this.headerText = "Quick Response";

    if (this.route.url == "/users/status") this.headerText = "Agent Status";

    this.sse.getMessage().subscribe((data) => {
      // console.log(data)
      this.service.getPortalStatus().subscribe((res: any) => {
        this.switchValue = res.status;
      });
      // this.service.userStatus().subscribe((res: any) => {
      //   let profile = JSON.parse(localStorage.getItem("profile"))
      //   profile.status = res.status
      //   this.myprofile.currentStatus = res.status
      //   localStorage.setItem('profile', JSON.stringify(profile))
      // })
      if (data.type == "status") {
        data = JSON.parse(data.data);

        if (data.email) {
          // console.log(this.myprofile.email == data.email)
          if (this.myprofile.email == data.email)
            this.changeStatus(data.status);
        } else {
          this.myprofile.currentStatus = "Offline";
          this.changeStatus("Offline");
          let profile = this.service.decryptData();
          profile.currentStatus = this.myprofile.currentStatus;
          this.service.encryptData(profile);
        }
      }
    });
  }

  changeStatus(status) {
    var data = {
      email: this.myprofile.email,
      currentStatus: status,
    };
    console.log(data);
    this.service.updateStatus(data).subscribe(
      (res) => {
        if (res) {
          this.myprofile.currentStatus = status;
          let profile = this.service.decryptData();
          console.log(profile)
          profile.currentStatus = status
          this.service.encryptData(profile);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showProfile() {
    this.route.navigateByUrl("/profile");
  }
  logout() {
    
    this.changeStatus("Offline");
    this.service.isLoggedin = false;
    this.route.navigateByUrl("/");
    setTimeout(() => {      
      localStorage.clear();
    }, 3000);

  }
  ngOnDestroy(){
    // console.log("interval stopped")
  
    this.apiService.reqSource.unsubscribe();
  }
}
