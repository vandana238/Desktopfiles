import { Component, OnInit } from '@angular/core';
import { QuickresponseService } from '../../services/quickresponse.service'
import { UserService } from '../../services/user.service'

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Routes, Router } from '@angular/router';

@Component({
  selector: 'app-quick-response',
  templateUrl: './quick-response.component.html',
  styleUrls: ['./quick-response.component.less']
})
export class QuickResponseComponent implements OnInit {

  constructor(private quickservice: QuickresponseService,private service: UserService,private route: Router, private modal: NzModalService) { }
  isVisible = false;
  isConfirmLoading = false;
  activeindex = -1;
  confirmModal?: NzModalRef;
  options = []
  isEdit = false
  isVisible1 = false
  isCategory = false
  editCategoryName
  category
  value
  temp = []
  isExist = false
  loader=true
  response
  modifiedText = null
  data = {
    "value": "",
    "label": "",
    "children": []
  }
  updateText = {
    "id": "",
    "modifiedText": "",
    "text": ""
  }
  showModal1(i): void {
    this.activeindex = i
    this.isVisible = true;
  }

  handleOk(): void {
    let index = this.options[this.activeindex].children.findIndex(obj => obj.value.trim().toLowerCase() == this.response.trim().toLowerCase())
    if (index == -1) {

      console.log(this.options[this.activeindex], this.response)
      this.isConfirmLoading = true;
      setTimeout(() => {
        this.isVisible = false;
        this.isConfirmLoading = false;
      }, 800);
      this.updateText.modifiedText = this.response
      if (!this.isEdit)
        this.options[this.activeindex].children.push({
          value: this.response,
          label: this.response,
          isLeaf: true
        })
      else
        this.options[this.activeindex].children[0].value = this.response
      this.response = ""
      this.isEdit = false
      console.log(this.updateText)

      this.quickservice.updateQuickResponse(this.updateText).subscribe(() => {
        this.quickservice.getQuickresponses().subscribe((res: any) => {

          this.options = []
          this.options = res
        })
      })
    } else {
      this.isExist = true
      setTimeout(() => {
        this.isExist = false
      }, 2000);
    }




  }

  handleCancel(): void {
    this.isVisible = false;
    console.log(this.isVisible1, this.visible)

  }

  edit(j, i) {
    this.isEdit = true
    this.updateText.id = this.options[j]._id
    // this.visible = true;
    this.data = this.options[j]
    this.category = this.options[j].value
    this.updateText.text = this.options[j].children[i].value

    this.response = this.options[j].children[i].value

    this.showModal1(j)
  }

  delete(j, i) {
    this.updateText.id = this.options[j]._id
    this.updateText.modifiedText = null
    this.updateText.text = this.options[j].children[i].value

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to delete this response?',
      nzOkText: "Delete",
      nzIconType: "delete",
      nzOkType: 'danger',
      nzCancelText: "Cancel",
      nzContent: "You cannot undo this operation",
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.options[j].children.splice(i, 1)
          this.quickservice.updateQuickResponse(this.updateText).subscribe(() => {
            this.quickservice.getQuickresponses().subscribe((res: any) => {

              this.options = []
              this.options = res
            })
          })
          setTimeout(Math.random() > 0.5 ? (resolve) : reject, 1000);
        }).catch(() => { })
    });
  }
  myprofile = this.service.decryptData()
  ngOnInit(): void {
    if(this.myprofile.role=="Agent")
    this.route.navigateByUrl('/error')
    // console.log(this.category)
    this.quickservice.getQuickresponses().subscribe((res: any) => {
      // console.log(res)
      this.options = res
      this.loader=false
    })
  }
  visible = false;

  open(): void {
    this.data = {
      "value": "",
      "label": "",
      "children": []
    }
    let select_box = document.getElementById("selected") as HTMLSelectElement;;
    select_box.selectedIndex = 0;
    this.data.children = []
    this.category = undefined
    this.value = undefined
    this.visible = true;
  }

  deleteCategory(j) {
    // console.log(this.options[j]._id)
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to delete this Category?',
      nzOkText: "Delete",
      nzIconType: "delete",
      nzOkType: 'danger',
      nzCancelText: "Cancel",
      nzContent: "This operation cannot be undone. This will delete all the responses in the category.",
      nzOnOk: () =>
        new Promise((resolve, reject) => {

          this.quickservice.deleteQuickResponse(this.options[j]._id).subscribe(() => {
            this.quickservice.getQuickresponses().subscribe((res: any) => {
              this.options = []
              this.options = res
            })
          })
          this.options[j].splice(j, 1)
          setTimeout(Math.random() > 0.5 ? (resolve) : reject, 1000);
        }).catch(() => { })
    });
  }
  editCategory(j) {
    this.isVisible1 = true
    this.editCategoryName = this.options[j].value
    this.activeindex = j
  }

  close(): void {
    this.visible = false;
  }
  addvalues() {

    if (this.value.trim().length > 0) {

      let text = {
        "value": this.value,
        "label": this.value,
        "isLeaf": true
      }
      let index = this.data.children.findIndex(obj => obj.value.toLowerCase() == this.value.toLowerCase())
      if (index == -1) {
        this.temp.push(text)
        this.data.children.unshift(text)
      } else {
        this.isExist = true
        setTimeout(() => {
          this.isExist = false
        }, 2000);
      }
    }
    this.value = undefined
  }


  createResponse() {
    // console.log(this.data)
    this.data.value = this.category
    this.data.label = this.category
    // this.data.children.concat(this.temp)
    this.temp = []
    // console.log(this.data)
    this.quickservice.createQuickResponse(this.data).subscribe((res) => {
      // console.log("create", res)
      this.data = {
        "value": "",
        "label": "",
        "children": []
      }
      this.data.children = []
      this.category = undefined
      this.value = undefined
      this.quickservice.getQuickresponses().subscribe((res: any) => {

        this.options = []
        this.options = res
      })
    }, (err) => {
      // console.log(err)
    })
    this.modal.success({
      nzTitle: 'Added Successfully',
      nzOkText: "Ok",
      nzContent: 'Responses saved'
    });
    this.visible = false;

  }

  removeText(i) {
    this.temp.splice(i, 1)
    this.data.children.splice(i, 1)
  }

  onOptionsSelected(t) {
    if (t == "New Category") {
      this.category = undefined
      this.data = {
        "value": "",
        "label": "",
        "children": []
      }
    }
    else {
      this.category = t
    }
    // console.log(this.category)
    var i = this.options.findIndex(obj => obj.value == t)
    if (i >= 0)
      this.data = this.options[i]
    else {

    }


  }



  handleOkEdit(j): void {
    setTimeout(() => {
      this.isVisible1 = false;
      this.isConfirmLoading = false;
    }, 800);
    this.options[this.activeindex].value = this.editCategoryName
    this.editCategoryName = undefined
    this.quickservice.createQuickResponse(this.options[j]).subscribe((res) => {
      this.quickservice.getQuickresponses().subscribe((res: any) => {
        this.options = []
        this.options = res
      })
    })
  }

  handleCancelEdit(): void {
    console.log(this.isVisible1, this.visible)

    this.isVisible1 = false;
  }


  drop(event: CdkDragDrop<string[]>, j): void {
    // console.log(event)
    moveItemInArray(this.options[j].children, event.previousIndex, event.currentIndex);
    this.quickservice.createQuickResponse(this.options[j]).subscribe((res: any) => {
      // console.log(res) 
      this.options[j]._id = res._id
      this.options[j].children = res.children
      //  console.log(this.options[j])
    }, (err) => {
      console.log(err)
    })
  }
  checkCategory() {
    // alert()
    if (this.category)
      var i = this.options.findIndex(obj => obj.value.trim().toLowerCase() == this.category.trim().toLowerCase())
    if (this.editCategoryName)
      var j = this.options.findIndex(obj => obj.value.trim().toLowerCase() == this.editCategoryName.trim().toLowerCase())

    if (i >= 0 || j >= 0)
      this.isCategory = true
    else
      this.isCategory = false

  }
  // change(j){
  //   this.quickservice.createQuickResponse(this.options[j]).subscribe((res) => {    
  //     // this.quickservice.getQuickresponses().subscribe((res: any) => {

  //     //   this.options = []
  //     //   this.options = res
  //     // })
  //   }, (err) => {
  //     console.log(err)
  //   })
  // }
}
