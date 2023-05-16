import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service'

@Component({
  selector: 'app-user-state',
  templateUrl: './user-state.component.html',
  styleUrls: ['./user-state.component.less']
})
export class UserStateComponent implements OnInit {

  constructor(private userService: UserService,) { }
  agentList=[]
  ngOnInit(): void {
    this.userService.getAgentList().subscribe((res: any) => {
      res.sort(obj=> (obj.status=='Online') ? -1 : 1)
      this.agentList = res
      var i = this.agentList.findIndex(obj => obj.userid == JSON.parse(localStorage.getItem('profile')).userid)
      if(i>=0)
      this.agentList.splice(i, 1)      
      var i = this.agentList.findIndex(obj => obj.role == 'superAdmin')
      if(i>=0)
      this.agentList.splice(i, 1)
    })
  }
 
}