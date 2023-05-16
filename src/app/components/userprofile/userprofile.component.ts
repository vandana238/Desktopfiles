import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Routes, Router } from '@angular/router';
import * as $ from 'jquery';

import { UserService } from '../../services/user.service'
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.less']
})
export class UserprofileComponent implements OnInit {
  confirmModal?: NzModalRef;
  myProfile=JSON.parse(localStorage.getItem('profile'))
  constructor(private modal: NzModalService, private router: Router,private service:UserService) { }
  showConfirm(): void {
    var data={
      "userid":this.myProfile.userId,
      "password":this.cpwd,
      "newPassword":this.newpwd
  }
  // console.log(data)
    this.service.changePassword(data).subscribe((res:any)=>{
      // console.log("sfsdffffffffffffffff",res)    
        var modal = this.modal.success({
          nzTitle: 'Your password has been reset successfully!',
          nzOkText:'ok',
          // nzContent: 'Please login with the new password'
        });
    
        setTimeout(() => modal.destroy(), 3000);
    },(err) => {

        var modal = this.modal.error({
          nzTitle: 'Invalid password',
          nzOkText:'ok',
          // nzContent: 'Please login with the new password'
        });
        setTimeout(() => modal.destroy(), 3000);
    })

    $('input').val('');

  }
  currentPassword = false;
  newPassword=false
  newPassword1=false
  password; cpwd;  newpwd;newpwd1; name; username;  email;  org;  role;
  ngOnInit(): void {
    this.myProfile=JSON.parse(localStorage.getItem('profile'))
    // console.log(this.myProfile)
  }

}
