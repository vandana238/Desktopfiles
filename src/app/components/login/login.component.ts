import { Component, OnInit } from "@angular/core";
import { Routes, Router } from "@angular/router";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
})
export class LoginComponent implements OnInit {
  constructor(private route: Router, private service: UserService) {
    // window.addEventListener("beforeunload", (event) => {
    //   this.changeStatus("Offline");
    // });
    // localStorage.clear();
  }
  user: any;
  pwd: any;
  showPswdWrong = false;
  ngOnInit(): void {
    this.service.isLoggedin = false;
    // localStorage.clear()
  }
  spinner = false;
  passwordVisible = false;
  myprofile;

  changeStatus(status) {
    this.myprofile.currentStatus = status;
    var data = {
      email: this.myprofile.email,
      currentStatus: this.myprofile.currentStatus,
    };
    this.service.updateStatus(data).subscribe((res) => {
      let profile = JSON.parse(localStorage.getItem("profile"));
      profile.status = this.myprofile.currentStatus;
      localStorage.setItem("profile", JSON.stringify(profile));
    });
  }

  login() {
    this.spinner = true;
    this.showPswdWrong = false;

    // this.service.isLoggedin=true
    // this.route.navigateByUrl('/home')
    if (this.user) {
      localStorage.setItem("user", "true");
    }
    this.service.login({ userid: this.user, password: this.pwd }).subscribe(
      (res: any) => {
        // localStorage.setItem('profile',JSON.stringify(res))
        this.service.isLoggedin = true;
        this.service.role = res.accountType;
        this.spinner = false;
        console.log(res)
        this.myprofile = {
          name: res.fullName,
          userId: res.userid,
          email: res.email,
          currentStatus: res.status,
          lastActive: Date.now(),
          role: res.role,
          token: res.token,
        };
        // this.service.secretKey='secret_profile_key'
        this.service.encryptData(this.myprofile);
        this.route.navigateByUrl("/home");
      },
      (err) => {
        console.log(err);
        this.spinner = false;

        this.showPswdWrong = true;
      }
    );
  }
}
