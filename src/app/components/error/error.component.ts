import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'
import { Routes, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.less']
})
export class ErrorComponent implements OnInit {

  constructor(public service:UserService,private route: Router) {
    this.service.isLoggedin=false    

   }

  ngOnInit(): void {

  }
back(){
  this.route.navigateByUrl('/home')
}
}
