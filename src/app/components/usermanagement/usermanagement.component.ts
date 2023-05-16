import { Component, OnInit, OnDestroy } from '@angular/core';
import { Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { UserService } from '../../services/user.service'
import * as $ from 'jquery';
import { interval } from 'rxjs';
import { SseserviceService } from '../../services/sseservice.service'
import { Observable } from "rxjs";
import { Routes, Router } from '@angular/router';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.less']
})
export class UsermanagementComponent implements OnInit {

  constructor(private userService: UserService, private route: Router, private modal: NzModalService, private sse: SseserviceService) { }
  loader = true
  loading = false
  copy = false
  pageSize = 1;
  pageIndex = 0;
  switchValue: boolean;
  switch = true;
  ismodalVisible = false
  isConfirmLoading = false;
  showerror = false
  checkPwd=''
  source = interval(5000);
  searchText=''
  resetpwd=''
  name=''
  pwd=''
  username=''
  email=''
  org=''
  role=''
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    // inputElement.setSelectionRange(0, 0);
  }
  subscribe = this.source.subscribe(val => {
    // console.log("interval running")
    this.getUsersList();
  });

  generatePassword(input) {
    this.copyInputMessage(input)
    this.loading = true
    this.userService.generatePassword().subscribe((res: any) => {
      this.pwd = res.generatePassword
      this.resetpwd = res.generatePassword
    })
    setTimeout(() => {
      this.copy = true
      this.loading = false
    }, 3000);
  }
  agentlist = []

ngOnDestroy(){
  // console.log("interval stopped")

  this.subscribe.unsubscribe();
}

  ngOnInit(): void {
    this.getUserList()    
    this.userService.getPortalStatus().subscribe((res: any) => {
      this.switchValue = res.status
    })
    this.userService.getAgentList().subscribe((res: any) => {
      // res.sort(obj => (obj.status == 'Online') ? -1 : 1)
      // var i: any = res.findIndex(obj => obj.userId == this.userService.decryptData().userId)
      // if (i >= 0) {
      //   res.splice(i, 1)
      // }
      console.log(this.userService.decryptData().userId)
      this.agentlist = res

      var i = this.agentlist.findIndex(obj => obj.userid == this.userService.decryptData().userId)
      if (i >= 0)
        this.agentlist.splice(i, 1)
      var i = this.agentlist.findIndex(obj => obj.role == 'superAdmin')
      if (i >= 0)
        this.agentlist.splice(i, 1)

      this.loader = false
    })
    this.sse.getMessage().subscribe(data => {
      if (data.type == 'status') {
        data = JSON.parse(data.data)
        if (data == "status")
          this.getUsersList()
        if (data.email) {
          let i = this.agentlist.findIndex(obj => obj.email == data.email)
          if (i >= 0)
            this.agentlist[i].status = data.status
        }
      }
      this.userService.getPortalStatus().subscribe((res: any) => {
        this.switchValue = res.status
      })
      this.userService.getAgentList().subscribe((res: any) => {
        res.sort(obj => (obj.status == 'Online') ? -1 : 1)
        var i: any = res.findIndex(obj => obj.userid == this.userService.decryptData().userId)
        if (i >= 0) {
          res.splice(i, 1)
          this.agentlist = res
        }
        var i: any = this.agentlist.findIndex(obj => obj.role == 'superAdmin')
        if (i >= 0) {
          res.splice(i, 1)
          this.agentlist = res
        }
      })
    })
  }
  agentList1 = []
  getUserList() {
    this.userService.getAgentList().subscribe((res: any) => {
      res.sort(obj => (obj.status == 'Online') ? -1 : 1)
      this.agentList1 = res
      var i = this.agentList1.findIndex(obj => obj.userid == this.userService.decryptData().userId)
      if (i >= 0)
        this.agentList1.splice(i, 1)
      var i = this.agentList1.findIndex(obj => obj.role == 'superAdmin')
      if (i >= 0)
        this.agentList1.splice(i, 1)
    })
  }

  getUsersList() {
    this.userService.getAgentList().subscribe((res: any) => {
      this.agentlist = res
      var i = this.agentlist.findIndex(obj => obj.userid == this.userService.decryptData().userId)
      if (i >= 0)
        this.agentlist.splice(i, 1)
      var i = this.agentlist.findIndex(obj => obj.role == 'superAdmin')
      if (i >= 0)
        this.agentlist.splice(i, 1)
    })
  }
  visible = false;
  visible1 = false
  password = false;
  resetPassword = false
  open(): void {
    this.visible = true;
  }
  editByUser(data): void {
    this.editUser = data
    this.visible1 = true;
  }
  close(): void {
    this.visible = false;
  }
  close1(): void {
    this.visible1 = false
  }

  register(name, username, email, org, pwd) {
    this.close()
    var data = {
      "fullName": name,
      "userid": username,
      "status": "Offline",
      "email": email,
      "password": this.pwd,
      "organization": org,
      "createdAt": Date.now(),
      "role": this.role

    }
    this.userService.register(data).subscribe((res: any) => {
      this.modal.success({
        nzTitle: 'New User Added',
        nzOkText: "Ok",
        nzContent: name + ' added successfully'
      });
      this.getUsersList()
      this.clear()
    }, (error) => {
      this.modal.error({
        nzOkText: "Ok",
        nzTitle: 'User ID already exists',
        nzContent: 'please create new userid'
      });
    })
  }
  confirmModal?: NzModalRef;
  showConfirm(id, i): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are you sure, you want to delete this user?',
      nzContent: ' This action cannot be undone',
      nzOkText: "Delete",
      nzIconType: "delete",
      nzCancelText: "Cancel",
      // nzContent: 'After clicking end chat. You can view this conversation in completed conversations section',
      nzOnOk: () =>
        this.removeUser(id, i)
      // new Promise((resolve, reject) => {
      //   setTimeout(Math.random() > 0.5 ? (resolve) : reject, 1000);
      // }).catch(() => console.log('Oops errors!'))
    });

  }

  updatePassword(id) {
    var data = {
      resetPassword: this.resetpwd,
      userid: id
    }
    this.close1()
    this.userService.resetPassword(data).subscribe((res) => {
      this.modal.success({
        nzTitle: 'Update User',
        nzOkText: "Ok",
        nzContent: 'User details updated succesfully'
      });
    }, (error) => {
      this.modal.error({
        nzOkText: "Ok",
        nzTitle: 'Updated user',
        nzContent: 'User details update failed'
      });
    })
  }
  removeUser(id, i) {
    this.userService.removeUser(id).subscribe((res) => {
      this.agentlist.splice(i, 1)
    })
  }
  clear() {
    $('input').val('');
    this.role = "undefined"
  }

  tplModal?: NzModalRef;
  tplModalButtonLoading = false
  editUser: any
  createTplModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, data): void {
    this.editUser = data
    this.tplModal = this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzWidth: 1000,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        value: 'Template Context'
      },
      nzOnOk: () => { }
    });
  }
  destroyTplModal(): void {
    this.tplModalButtonLoading = true;
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      this.tplModal!.destroy();
    }, 1000);
  }


  changeIndex(e) {
    this.pageIndex = e - 1
  }
  myprofile = this.userService.decryptData()
  switchAgent() {
    this.ismodalVisible = true;

  }
  updateUserStatus(status, i) {

    this.agentlist[i].status = status
    var data = {
      email: this.agentlist[i].email,
      currentStatus: status,
      sendEvent: true
    }
    this.userService.updateStatus(data).subscribe((res) => {
    })
  }
  handleOk() {
    // console.log("login",this.checkPwd.length > 0)

    // if (this.checkPwd.length > 0)
    this.userService.login({ "userid": this.myprofile.userId, "password": this.checkPwd }).subscribe((res: any) => {
      // console.log("login",res)
      this.switch = false
      if (this.switchValue) {
        this.myprofile.currentStatus = "Offline"
        let profile = this.userService.decryptData()
        profile.currentStatus = this.myprofile.currentStatus
        this.userService.encryptData(profile)        
        this.userService.updateAllagentStatus({ status: "Offline" }).subscribe((res) => {
          this.switchValue = !this.switchValue
          this.userService.updatePortalStatus({ "status": this.switchValue }).subscribe((res) => {
            // console.log(res)
          })
        })
      }
      else {
        this.switchValue = !this.switchValue
        this.userService.updatePortalStatus({ "status": this.switchValue }).subscribe((res) => {
          // console.log(res)

        })
      }
      setTimeout(() => {
        this.ismodalVisible = false;
        this.isConfirmLoading = false;
        this.checkPwd = ''
      }, 800);
    }, (err) => {
      // console.log(err)
      this.showerror = true
    })


  }

  handleCancel(): void {

    this.ismodalVisible = false;
  }
}
