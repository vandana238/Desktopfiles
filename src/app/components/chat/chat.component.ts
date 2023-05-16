import {
  Component,
  TemplateRef,
  ViewChild,
  OnInit,
  ElementRef,
} from '@angular/core';
// import {  WebPubSubServiceClient ,AzureKeyCredential} from '@azure/web-pubsub';

import { Title } from '@angular/platform-browser';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Routes, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { interval } from 'rxjs';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { SseserviceService } from '../../services/sseservice.service';
import { ApiserviceService } from '../../services/apiservice.service';
import { UserService } from '../../services/user.service';
import { ConvosService } from '../../services/convos.service';
import { QuickresponseService } from '../../services/quickresponse.service';
import { MessagesService } from '../../services/messages.service';
import { DateagoPipe } from '../../pipes/dateago.pipe'; // import { Component, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { RemedyService } from '../../services/remedy.service';
import { Howl } from 'howler';
import { Observable } from 'rxjs';
import { getISOWeek } from 'date-fns';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
// let service =  new WebPubSubServiceClient("Endpoint=https://agentnotify.webpubsub.azure.com;AccessKey=PIh0j+Jcs4CxFu7N7FTTljkEfhnxvxm7e9tt+CQWPec=;Version=1.0;", "agentnotify");

// import { MustMatch } from './_helpers/must-match.validator'; getTicketInfo
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(1000)),
    ]),
  ],
})
export class ChatComponent implements OnInit {
  constructor(
    private title: Title,
    private i18n: NzI18nService,
    private remedy: RemedyService,
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private quickservice: QuickresponseService,
    private userService: UserService,
    private convosService: ConvosService,
    private messagesService: MessagesService,
    private notification: NzNotificationService,
    private router: Router,
    private iconService: NzIconService,
    private modal: NzModalService,
    private service: ApiserviceService,
    private sseService: SseserviceService
  ) {
    this.i18n.setLocale(en_US);
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
    });
  }

  get f() {
    return this.ticketForm.controls;
  }
  @ViewChild('scrollMe') comment: ElementRef;

  ticketForm: FormGroup;
  submitted = false;
  rmerrors: any;
  rmsolutions: any = [];
  timeout: any;
  isVisible = false;
  // title = 'Push Notification';
 search = { name: null, email: null, channel: null, date: null };

  loader = true;
  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';
  quickResponse = false;
  options = [];
  suggested = 'hello, how can i help you';
  nzOptions: NzCascaderOption[] | null = null;
  values: string;
  confirmModal?: NzModalRef; // For testing by now
  term: String;
  message: String;
  isSpinning = false;
  visible = false;
  showConversation = false;
  activetab = 'Active';
  activeuser;
  activeIndex = -1;
  searchText: String;
  ongoing = [];
  star = [];
  newlist = [];
  archive = [];
  completed = [];
  abandoned = [];
  starred = [];
  newMessageChat = 0;
  agentList = [];
  scrollLoader = false;
  isActive = true;
  scrolltop: number = null;
  source = interval(5000);
  // requestSource = interval(2500);
  activeRequestCount = 0;
  n = 50;
  loaderConvos = false;
  viewTicket = false;
  otherAgentConvos = [];
  searchConversation;
  refreshInterval;
  categories = [];
  resolutions = [];
  causes = [];
  projectids = [];
  priorities = [];
  casetypes = [];
  groups = [];
  endUserResponses = [];
  inputLoader = false;
  ownergroups = [
    'APAC-SAP-PGL Support',
    'EMEA-SAP-PGL Support',
    'LA-SAP-PGL Support',
    'NA-SAP-PGL Support',
    'ENT-SAP-Client Services',
  ];
  assigneeMembers = [];
  ownerMembers = [];
  sound = new Howl({
    src: ['../../../assets/msgtone.mp3'],
  });
  RequestTone = new Howl({
    src: ['../../../assets/notification.mp3'],
  });
  recent = {
    value: 'Recent',
    label: 'Recent',
    children: [],
  };
  colors = [
    '#ff3300',
    '#0080ff',
    '#009933',
    '#7300e6',
    '#e600e6',
    '#9900ff',
    '#009966',
    '#0099cc',
    '#cc3300',
    '#00cccc',
    '#669999',
    '#d63b99',
    '#d6d64a',
    '#00dbff',
    '#6c9393',
    '#666699',
  ];
  prevTitle = 'Live Agent Portal';
  subscribe = this.source.subscribe((val) => {
    // console.log(val)
    //  this.dateago.transform(this.activeuser.transcript[this.activeuser.transcript.length-1].timestamp)
    // console.log(this.isActive)
    // if (!this.isActive)
    this.notify();
  });

  reqSource = this.service.requestSource.subscribe((val) => {
    this.getnewList();
  });
  myprofile = this.userService.decryptData();
  transcriptLoader = false;

  ticketLoader = false;
  showModal(): void {
    this.isVisible = true;
  }
  getWeek(result: Date[]): void {
    // console.log('week: ', result.map(getISOWeek));
  }
  getRandom() {
    const min = Math.ceil(0);
    const max = Math.floor(16);
    return Math.floor(Math.random() * (max - min) + min);
  }

  notify() {
    if (this.ongoing.length != 0) {
      for (let i = 0; i < this.ongoing.length; i++) {
        if (
          this.ongoing[i].transcript[this.ongoing[i].transcript.length - 1]
            .origin == 'user'
        ) {
          const datetime = Date.parse(
            this.ongoing[i].transcript[this.ongoing[i].transcript.length - 1]
              .timestamp
          );

          const now = new Date().getTime();
          let milisec_diff
          // console.log(datetime,now)
          if (datetime < now) {
             milisec_diff = now - datetime;
          } else {
             milisec_diff = datetime - now;
          }
          const difference = Math.round(milisec_diff / 1000 / 60);
          // console.log(difference)
          if (difference > 1) {
            this.ongoing[i].lastActive = difference;
            // console.log(this.ongoing[i])
          }
          // if (difference > 120) {
          //   this.changeStatus("Away")
          // }
        }
      }
    }
  }
  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to end this conversation?',
      nzOkText: 'End chat',
      nzIconType: 'delete',
      nzOkType: 'danger',
      nzCancelText: 'Cancel',
      nzContent:
        'After clicking \'End Chat\', you can view this conversation in completed conversations section.',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.endchat();
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => {}),
    });
  }

  createNotification(type, title, msg, time): void {
    this.notification.create(type, title, msg, {
      nzDuration: time,
      nzPlacement: 'topRight',
    });
  }

  open(): void {
    this.visible = true;
  }
  close(): void {
    this.visible = false;
  }

  changeStatus(status) {
    this.myprofile.currentStatus = status;
    const data = {
      email: this.myprofile.email,
      currentStatus: this.myprofile.currentStatus,
    };
    this.userService.updateStatus(data).subscribe((res) => {
      const profile = JSON.parse(localStorage.getItem('profile'));
      profile.status = this.myprofile.currentStatus;
      localStorage.setItem('profile', JSON.stringify(profile));
    });
  }
  // async ngOnInit(): Promise<void> {
  //   this.subscribeNotification();
  // }

  // async publishNotification() {
  //   const serviceClient = new WebPubSubServiceClient(
  //     this.endpoint,
  //     this.cred,
  //     'agentnotify'
  //   );
  //   const result = await serviceClient.sendToAll('Hello World', {
  //     contentType: 'text/plain',
  //   });
  //   console.log(result);
  // }

  // async subscribeNotification() {
  //   const serviceClient = new WebPubSubServiceClient("Endpoint=https://agentnotify.webpubsub.azure.com;AccessKey=PIh0j+Jcs4CxFu7N7FTTljkEfhnxvxm7e9tt+CQWPec=;Version=1.0;", "agentnotify");
  //   const token = await serviceClient.getClientAccessToken();
  //   const ws = new WebSocket(token.url);
  //   ws.onmessage = function(e) {
  //     const server_message = e.data;
  //     console.log(server_message);
  //   };
  // }
  getList() {
    this.userService.getAgentList().subscribe((res: any) => {
      this.agentList = res.filter(
        (obj) => obj.status == 'Online' && obj.userid != this.myprofile.userId
      );
      this.convosService.getConvosCount().subscribe((res: any) => {
        res.map((obj1) => {
          const i = this.agentList.findIndex((obj) => obj.userid == obj1._id);
          if (i >= 0) {
            this.agentList[i].count = obj1.count;
          }
        });
        this.loader = false;
      });
    });
  }

  sendAck(data) {
    const dataCopy = {
      botID: data.botID,
      channel: data.channel,
      conversationID: data.conversationID,
      user: { name: data.user.name, id: data.user.id },
      _id: data._id,
      agent: this.myprofile.userId,
      agentName: this.myprofile.name,
    };
    // console.log(dataCopy)
    this.convosService.accept(dataCopy).subscribe((res) => {});
  }
  show(user) {
    clearInterval(this.refreshInterval);
    // console.log(user)
    this.viewTicket = false;

    this.activeuser = user;
    this.showConversation = true;
    this.transcriptLoader = true;
    // console.log(this.activeuser)

    setTimeout(() => {
      this.transcriptLoader = false;
    }, 2000);
  }

  showOtherAgent(user) {
    // console.log(user)
    this.activeuser = user;
    this.showConversation = true;
    this.transcriptLoader = true;
    this.viewTicket = false;
    // console.log(this.activeuser)
    this.refreshInterval = setInterval(() => {
      this.messagesService
        .getMessageById(user.conversationID)
        .subscribe((res: any) => {
          // console.log("trigger")
          user.transcript = [];
          user.transcript = res;
        });
    }, 15000);

    setTimeout(() => {
      this.transcriptLoader = false;
    }, 2000);
  }

  archiveUser(user) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to archive this conversation?',
      nzOkText: 'Archive',
      nzIconType: 'down-circle',
      nzOkType: 'primary',
      nzCancelText: 'Cancel',
      nzStyle: {
        color: 'green',
      },
      nzContent:
        'After clicking archive chat. You can view this conversation in archived conversations section',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 200);
          this.activeuser = {};
          const i = this.completed.findIndex(
            (obj) => obj.conversationID == user.conversationID
          );
          this.completed.splice(i, 1);
          this.archive.push(user);
          user.status = 'Archived';
          this.convosService
            .updateConvoStatus({
              conversationID: user.conversationID,
              status: 'Archived',
            })
            .subscribe((res) => {
              // console.log(res)
            });
        }).catch(() => console.log('Oops errors!')),
    });
  }
  unArchiveUser(user) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you want to Unarchive this conversation?',
      nzOkText: 'Unarchive',
      nzIconType: 'up-circle',
      nzOkType: 'primary',
      nzCancelText: 'Cancel',
      nzContent:
        'After clicking Unarchive chat. You can view this conversation in closed conversations section',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 200);
          this.activeuser = {};
          user.status = 'completed';
          const i = this.archive.findIndex(
            (obj) => obj.conversationID == user.conversationID
          );
          if (i != -1) {
            this.archive.splice(i, 1);
          }
          this.completed.unshift(user);
          this.convosService
            .updateConvoStatus({
              conversationID: user.conversationID,
              status: 'Completed',
            })
            .subscribe((res) => {
              // console.log(res)
            });
        }).catch(() => console.log('Oops errors!')),
    });
  }
  clear() {
    this.loaderConvos = true;
    this.activeIndex = -1;
    this.activeuser = {};
    setTimeout(() => {
      this.loaderConvos = false;
    }, 2000);
  }
  accept(user) {
    this.viewTicket = false;
    this.isSpinning = false;
    localStorage.setItem('id', user.conversationID);

    this.activeuser = {};
    const i = this.newlist.findIndex(
      (obj) => obj.conversationID == user.conversationID
    );
    // console.log(user, i);
    user.agent = {
      id: this.myprofile.userId,
      name: this.myprofile.name,
    };
    this.convosService.getUserStatus(user.conversationID).subscribe((res) => {
      // console.log(res);
      if (res) {
        user.profile = this.colors[this.getRandom()];
        this.showConversation = false;
        this.activeuser = user;
        this.ongoing.unshift(user);
        const j = this.ongoing.findIndex(
          (obj) => obj.conversationID == user.conversationID
        );
        // console.log(user);
        this.activeIndex = j;
        if (user.status != 'Accepted') {
          this.sendAck(user);
          this.ongoing[j].requestAt = Date.now();
          this.ongoing[j].newMessages = false;
        }
        this.ongoing[j].status = 'Accepted';
        this.newlist.splice(i, 1);
        this.activeRequestCount = this.activeRequestCount - 1;
        if (this.ongoing[j].incidentId) {
          this.onviewInfo();
          this.viewTicket = true;
        }
        // document.getElementById(user.transcript[user.transcript.length - 1].text).scrollIntoView();
      } else {
        this.newlist.splice(i, 1);
      }
    });
    setTimeout(() => {
      this.convosService
        .getUserList(this.myprofile.userId, 'Requested')
        .subscribe(
          (res: any) => {
            // console.log(res)
            if (res.status && res.message.length > 0) {
              this.newlist = [];
              res.message.map((obj) => {
                return (obj.profile = this.colors[this.getRandom()]);
              });
              this.newlist = res.message;
            }
          },
          (err) => {
            // console.log(err);
          }
        );
    }, 2000);
  }
  select(user, i) {
    this.isSpinning = false;
    localStorage.setItem('id', user.conversationID);

    this.showConversation = false;
    if (user.status == 'Requested') { this.sendAck(user); }
    this.activeuser = user;
    this.activeIndex = this.ongoing.findIndex(
      (obj) => obj.conversationID == this.activeuser.conversationID
    );

    const j = this.ongoing.findIndex(
      (obj) => obj.conversationID == user.conversationID
    );
    if (this.ongoing[j].newMessages) { this.ongoing[j].newMessages = false; }
    this.newMessageChat = this.ongoing.filter(
      (x) => x.newMessages == true
    ).length;
    this.activeIndex = i;
    if (this.ongoing[i].incidentId) {
      this.onviewInfo();
      this.viewTicket = true;
    }
  }

  refresh(user) {
    this.convosService.getTranscript(user.conversationID).subscribe((res) => {
      // console.log(res)
      user.transcript = res;
    });
  }
  sendMessage() {
    this.quickResponse = false;
    const i = this.ongoing.findIndex(
      (obj) => obj.conversationID == this.activeuser.conversationID
    );
    this.activeuser.lastActive = 0;
    if (i != 0) {
      const temp = this.ongoing[i];
      this.ongoing.splice(i, 1);
      this.ongoing.splice(0, 0, temp);
    }

    if (this.message.trim() != '') {
      const data = {
        user: {
          name: this.myprofile.name,
          id: this.myprofile.userId,
        },
        channel: this.activeuser.channel,
        dialogId: this.activeuser.dialogId,
        conversationID: this.activeuser.conversationID,
        origin: 'agent',
        type: 'message',
        text: this.message,
        botID: this.activeuser.mInsightsBotID,
        timestamp: Date.now(),
      };

      this.activeuser.transcript.push(data);
      this.messagesService.sendMessage(data).subscribe((res: any) => {
        // console.log("post data", res)
        this.myprofile.lastActive = Date.now();
      });
      // console.log(this.activeuser.transcript)
    }
    this.message = undefined;
  }

  // logout() {
  //   localStorage.clear();
  //   this.router.navigateByUrl("/login");
  // }

  endchat() {
    const i = this.ongoing.findIndex(
      (obj) => obj.conversationID == this.activeuser.conversationID
    );
    if (i != -1) { this.ongoing[i].status = 'Completed'; }
    this.completed.push(this.ongoing[i]);
    const data = {
      agentName: this.myprofile.name,
      text: 'Your chat has been ended by ' + this.myprofile.name,
      botConvId: this.ongoing[i].conversationID,
      agentConvId: '',
      username: this.ongoing[i].user.name,
      from: {
        role: 'bot',
      },
      timestamp: Date.now(),
      dialogID: this.ongoing[i].dialogId,
    };
    this.convosService.endchat(data).subscribe((res: any) => {});
    if (this.ongoing[i].incidentId) {
      this.onviewInfo();
      this.viewTicket = true;
      const msgdata = {
        user: {
          name: this.myprofile.name,
          id: this.myprofile.userId,
        },
        channel: this.activeuser.channel,
        dialogId: this.activeuser.dialogId,
        conversationID: this.activeuser.conversationID,
        origin: 'agent',
        type: 'message',
        text:
          'Your ticket for this conversation has been automatically created. Your ticket number is : ' +
          this.ongoing[i].incidentId,
        botID: this.activeuser.mInsightsBotID,
        timestamp: Date.now(),
      };

      this.activeuser.transcript.push(msgdata);
      this.messagesService.sendMessage(msgdata).subscribe((res: any) => {
        this.myprofile.lastActive = Date.now();
      });
      this.updateTicket(false);
    }

    this.activeIndex = -1;
    this.ongoing.splice(i, 1);

    this.activeuser = {};
    this.viewTicket = false;
    this.isSpinning = false;
  }
  enduser(user, i) {
    if (i != -1) { this.ongoing[i].status = 'Completed'; }
    this.completed.push(this.ongoing[i]);
    const data = {
      text: 'Your chat has been eneded by agent - ' + this.myprofile.name,
      botConvId: this.ongoing[i].conversationID,
      agentConvId: '',
      username: this.ongoing[i].username,

      from: {
        role: 'bot',
      },
      timestamp: Date.now(),
      dialogID: this.ongoing[i].dialogId,
    };
    this.convosService.endchat(data).subscribe((res: any) => {});
    this.activeIndex = -1;
    this.ongoing.splice(i, 1);
    this.activeuser = {};
  }

  searchMessage() {
    const items = this.activeuser.transcript;
    if (!items) {
      return [];
    }
    if (!this.searchText) {
      return items;
    }
    const searchText = this.searchText.toLocaleLowerCase();

    return items.filter((it) => {
      if (
        it.text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      ) {
        document.getElementById(it.text).scrollIntoView();
      }
    });
  }

  searchConvo() {
    const items = this.newlist.concat(this.ongoing);
    if (!items) {
      return [];
    }
    if (!this.searchText) {
      return items;
    }
    const searchText = this.searchText.toLocaleLowerCase();
    return items.filter((it) => {
      if (
        it.user.name
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase())
      ) {
        return it;
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.ticketForm.invalid) {
      return;
    }
  }

  onReset() {
    this.submitted = false;
    this.ticketForm.reset();
    this.viewTicket = false;
    this.isSpinning = false;
  }
  onviewInfo() {
    // console.log(this.activeuser);
    this.ticketLoader = true;
    this.viewTicket = true;
    this.isSpinning = false;
    this.remedy
      .getTicketInfo(this.activeuser.incidentId)
      .subscribe((res: any) => {
        this.activeuser.incidentData = res;
        // console.log(res);
        let summary = '';
        if (res.summary != null) { summary = res.summary; }
        this.ticketForm = this.formBuilder.group({
          summary: [summary, Validators.required],
          casetype: [res.casetype, Validators.required],
          priority: [res.priority, Validators.required],
          categorization: [res.categorization, Validators.required],
          sapcause: [res.cause],
          resolution: [res.resolution],
          taberror: [res.error, Validators.required],
          solution: [res.solution, Validators.required],
          assigned: [res.assigned, Validators.required],
          projectid: [res.projectID],
          assignedgroup: [res.assignedgroup, Validators.required],
          textresolution: [res.textresolution, Validators.required],
          owner: [res.owner],
          ownergroup: [res.ownergroup, Validators.required],
          enduserresponse: [res.enduserresponse, Validators.required],
        });
        this.remedy.getMembers('SGP000000008214').subscribe((res: any) => {
          // console.log("assigneeMembers", res.values);
          this.assigneeMembers = res.values;
        });
        this.remedy.getMembers('SGP000000007916').subscribe((res: any) => {
          // console.log(res.values);
          this.ownerMembers = res.values;
        });
        const i = this.groups.findIndex(
          (obj) => obj.name == res.assignedgroup
        );
        if (i != -1) {
          this.remedy.getMembers(this.groups[i].id).subscribe((res: any) => {
            this.assigneeMembers = res.values;
          });
        }
        const j = this.groups.findIndex((obj) => obj.name == res.ownergroup);
        if (j != -1) {
          this.remedy.getMembers(this.groups[j].id).subscribe((res: any) => {
            this.ownerMembers = res.values;
          });
        }
        this.ticketLoader = false;
      });
  }
  selectedAssigneeGroup(id: any) {
    this.assigneeMembers = [];
    this.ticketForm.controls.assigned.reset();

    const i = this.groups.findIndex((obj) => obj.name == id.target.value);
    // console.log(this.groups[i].id);
    this.remedy.getMembers(this.groups[i].id).subscribe((res: any) => {
      // console.log(res.values);
      this.ticketForm.value.groupid = this.groups[i].id;
      this.assigneeMembers = res.values;
    });
  }
  selectedOwnerGroup(id: any) {
    this.ownerMembers = [];
    this.ticketForm.controls.owner.reset();
    const i = this.groups.findIndex((obj) => obj.name == id.target.value);
    // console.log(this.groups[i].id);
    this.remedy.getMembers(this.groups[i].id).subscribe((res: any) => {
      // console.log(res.values);
      this.ownerMembers = res.values;
    });
  }
  selectedRmerror(id: any) {
    // console.log(id);
    this.rmsolutions = [];
    this.ticketForm.controls.solution.reset();
    this.ticketForm.controls.enduserresponse.reset();

    this.remedy.getRMSolution(id).subscribe(
      (res: any) => {
        this.rmsolutions = res.values;
        // console.log(this.rmsolutions);
      },
      (err) => {
        this.rmsolutions = [''];
        this.endUserResponses = [];
      }
    );
  }
  selectRMresolution(index) {
    this.ticketForm.controls.enduserresponse.reset();

    this.endUserResponses = [];
    // console.log("index",index,this.rmsolutions)
    if (this.rmsolutions != null && this.rmsolutions.length > 0) {
      this.endUserResponses = [this.rmsolutions[index].endUserResponse];
    }
    // var id=list.innerHTML.getAttribute('id')
    // console.log(id)

    // this.inputLoader = true;
    // this.endUserResponses = [resolution];
    // this.endUserResponses = this.rmsolutions.filter((obj: any) => {

    //    if (obj.proposedSolution.replace(/[^a-zA-Z ]/g, "").replace(" ", "")==resolution.replace(/[^a-zA-Z ]/g, "").replace(" ", "")) return obj.endUserResponse;
    // });
    // console.log(this.endUserResponses);
    // this.ticketForm.value.solution
    // this.remedy.getEndUserResponse(resolution).subscribe(
    //   (res: any) => {
    //     // console.log(res);
    //     this.endUserResponses = res.values;
    //     this.inputLoader = false;
    //   },
    //   (error) => {
    // this.endUserResponses = [];
    //   }
    // );
  }
  setEndUserResponse(data) {
    // console.log(data)
    this.endUserResponses = [];

    this.endUserResponses = [data.endUserResponse];
    return data.proposedSolution;
  }
  blink(msg: string, count: number = 20): void {
    const step = () => {
      const newTitle =
        this.title.getTitle() === this.prevTitle ? msg : this.prevTitle;

      this.title.setTitle(newTitle);

      if (--count) {
        this.timeout = setTimeout(step.bind(this), 1000);
      } else {
        this.title.setTitle(this.prevTitle);
      }
    };

    clearTimeout(this.timeout);
    step();
  }
  ngOnInit() {
    // this.subscribeNotification();

    this.title.setTitle(this.prevTitle);
    // this.blink("New request");
    // this.createNotification(
    //   "info",
    //   "New Request",
    //   "You have a new request",
    //   5000
    // );

    if (!localStorage.getItem('user')) { this.router.navigateByUrl(''); }
    this.remedy.getcategories().subscribe((res: any) => {
      // console.log(res)
      this.categories = res.values;
    });
    this.remedy.getresolution().subscribe((res: any) => {
      // console.log(res)
      this.resolutions = res.values;
    });
    this.remedy.getcause().subscribe((res: any) => {
      // console.log(res)
      this.causes = res.values;
    });
    // this.remedy.getpriorities().subscribe((res: any) => {
    //   // console.log(res)
    //   this.priorities = res.values;
    // });
    // this.remedy.getcasetypes().subscribe((res: any) => {
    //   // console.log(res)
    //   this.casetypes = [];
    // });
    this.remedy.getProjectids().subscribe((res: any) => {
      // console.log(res)
      this.projectids = res.values;
    });
    this.remedy.getGroups().subscribe((res: any) => {
      // console.log(res);
      this.groups = res.values;
      this.ownergroups = this.groups.filter((value) =>
        this.ownergroups.includes(value.name)
      );
    });
    this.remedy.getRMError().subscribe((res: any) => {
      // console.log(res);
      this.rmerrors = res.values;
    });

    this.ticketForm = this.formBuilder.group({
      summary: ['', Validators.required],
      casetype: ['', Validators.required],
      priority: ['', Validators.required],
      categorization: ['', Validators.required],
      sapcause: [''],
      resolution: [''],
      taberror: ['', Validators.required],
      solution: ['', Validators.required],
      projectid: [''],
      owner: [''],
      ownergroup: ['', Validators.required],
      assigned: ['', Validators.required],
      assignedgroup: ['', Validators.required],
      textresolution: ['', Validators.required],
      enduserresponse: ['', Validators.required],
    });

    this.service.isLoggedin = true;
    this.loaderConvos = true;
    this.getOngoingList();
    this.getnewList();
    this.getCompleted();
    this.getAbandoned();
    this.getArchived();
    this.getStarred();
    this.notify();
    if (this.ongoing.length > 0) {
      this.ongoing[0].active = true;
      this.activeIndex = 0;
      this.activeuser = this.ongoing[0];
    }
    this.sseService.connect().subscribe((data) => {
      console.log("data in connect", data)
      this.RequestTone.play();
      this.service.showNotification(
        'Live agent portal',
        'You have a new request'
      );
      this.blink('New request');
      this.createNotification(
        'info',
        'New Request',
        'You have a new request',
        5000
      );
    })
    this.sseService.getMessage().subscribe((data) => {
      // console.log(this.myprofile.currentStatus)
      // if (data.type == "request" && this.myprofile.currentStatus == "Online") {
      //   this.service.showNotification(
      //     "Live agent portal",
      //     "You have a new request"
      //   );
      //   this.convosService
      //     .getUserList(this.myprofile.userId, "Requested")
      //     .subscribe(
      //       (res: any) => {
      //         if (res.status && res.message.length > 0) {
      //           res.message.map((obj) => {
      //             return (obj.profile = this.colors[this.getRandom()]);
      //           });
      //           this.newlist = [];
      //           this.newlist = res.message.filter(
      //             (obj) => obj.status === "Requested"
      //           );
      //         } else {
      //         }
      //       },
      //       (err) => {
      //         // console.log(err);
      //       }
      //     );
      // }
      if (data.type == 'cancelRequest') {
        data = JSON.parse(data.data);
        const i = this.newlist.findIndex((obj) => obj.conversationID == data.id);
        if (i >= 0) { this.newlist.splice(i, 1); }
        if (
          this.newlist.findIndex(
            (obj) => obj.conversationID == this.activeuser.conversationID
          )
        ) {
          this.activeuser = {};
        }
      }

      if (data.type == 'transfer') {
        data = JSON.parse(data.data);
        // console.log('transfer', data)
        this.convosService.getConvosById(data.userId).subscribe((res: any) => {
          if (
            res.status &&
            res.message.length > 0 &&
            data.agent.id == this.myprofile.userId
          ) {
            this.activeuser = {};
            this.RequestTone.play();
            this.createNotification(
              'info',
              'Transfer Request',
              'You have a new transfer request',
              5000
            );

            res.message[0].profile = this.colors[this.getRandom()];
            res.message[0].transferagent = data.fromagent;
            this.ongoing.push(res.message[0]);
            // console.log(this.ongoing, res.message[0])
            const i = this.otherAgentConvos.findIndex(
              (obj) => obj.conversationID == data.userId
            );
            this.otherAgentConvos.splice(i, 1);
            // this.convosService.getOngoingList(this.myprofile.userId).subscribe((res: any) => {
            //   if (res.status && res.message.length > 0) {
            //     res.message.map(obj => {
            //       return obj.profile = this.colors[this.getRandom()]
            //     })
            //     this.otherAgentConvos = []
            //     this.otherAgentConvos = res.message
            //   }
            // })
          }
        });
      }

      if (data.type == 'notify') {
        data = JSON.parse(data.data);
        const i = this.ongoing.findIndex(
          (obj) => obj.conversationID == data.conversationID
        );

        this.createNotification(
          'warning',
          'Alert',
          this.ongoing[i].username,
          2000
        );
      }
      if (data.type == 'message') {
        data = JSON.parse(data.data);

        // console.log('transfer', data)
        this.messagesService.getMessageById(data).subscribe((res: any) => {
          // console.log(res[res.length - 1], res[res.length - 1].text == undefined)
          if (res[res.length - 1].text == undefined) {
            const tempdata = {
              user: {
                name: this.myprofile.name,
                id: this.myprofile.userId,
              },
              channel: this.activeuser.channel,
              dialogId: this.activeuser.dialogId,
              conversationID: this.activeuser.conversationID,
              origin: 'agent',
              type: 'message',
              text:
                'Currently, your conversation with agent does not support attachments. Please continue using the text messages to chat.',
              botID: this.activeuser.mInsightsBotID,
              timestamp: Date.now(),
            };
            this.messagesService.sendMessage(tempdata).subscribe((res: any) => {
              // console.log("post data", res)
              this.myprofile.lastActive = Date.now();
            });
          }
          const data = res;
          // console.log(data)
          const i = this.ongoing.findIndex(
            (obj) => obj.conversationID == data[0].conversationID
          );

          this.scrolltop = this.comment.nativeElement.scrollHeight;
          this.newMessageChat;
          // console.log(this.ongoing, i)
          if (data.botMessage != 'undefined') {
            this.sound.play();
            this.ongoing[i].dialogId = data[data.length - 1].dialogId;
            this.ongoing[i].transcript = data;
          }
          if (
            this.ongoing[i].conversationID != this.activeuser.conversationID
          ) {
            this.sound.play();
            this.ongoing[i].newMessages = true;
            const temp = this.ongoing[i];
            this.ongoing.splice(i, 1);
            this.ongoing.splice(1, 0, temp);
            this.newMessageChat = this.ongoing.filter(
              (x) => x.newMessages == true
            ).length;
          }
        });
      }
      // if (data.type == "enduser") {
      //   data = JSON.parse(data.data);
      //   // console.log("enduser", data)
      //   if (this.activeuser) {
      //     var i = this.otherAgentConvos.findIndex(
      //       (obj) => obj.conversationID == this.activeuser.conversationID
      //     );
      //     if (i >= 0) this.activeuser = {};
      //     var i = this.ongoing.findIndex(
      //       (obj) => obj.conversationID == data.conversationID
      //     );
      //   }

      //   if (true) {
      //     var j = this.otherAgentConvos.findIndex(
      //       (obj) => obj.conversationID == data.conversationID
      //     );
      //     // console.log(j, this.otherAgentConvos)
      //     if (j >= 0) {
      //       // alert()
      //       this.modal.info({
      //         nzTitle: "This is a notification message",
      //         nzContent:
      //           "Due to inactivity this conversation has been ended. You can view this in abandoned section ",
      //         nzOkText: "Ok",
      //         nzOnOk: () => {
      //           this.otherAgentConvos.splice(j, 1);
      //         },
      //       });
      //     }
      //   }
      //   //  console.log(this.ongoing)
      //   this.activeIndex = -1;
      //   this.ongoing[i].status = "Completed";
      //   this.activeuser = {};
      //   this.abandoned.push(this.ongoing[i]);
      //   this.ongoing.splice(i, 1);
      // }

      if (data.type == 'agentended') {
        data = JSON.parse(data.data);

        const i = this.otherAgentConvos.findIndex(
          (obj) => obj.conversationID == data.conversationID
        );
        if (i >= 0) { this.activeuser = {}; }
        // console.log("agentended", data)
        if (true) {
          const j = this.otherAgentConvos.findIndex(
            (obj) => obj.conversationID == data.conversationId
          );
          // console.log(j, this.otherAgentConvos)
          if (j >= 0) {
            // alert()
            this.modal.info({
              nzTitle: 'This is a notification message',
              nzContent:
                'The agent has ended this conversation. You can view this in completed section ',
              nzOkText: 'Ok',
              nzOnOk: () => {
                this.completed.push(this.otherAgentConvos[j]);
                this.otherAgentConvos.splice(j, 1);
              },
            });
          }
        }
      }
      if (data.type == 'userAccepted') {
        if (this.newlist.length > 0) {
          this.activeRequestCount = this.activeRequestCount - 1;
          data = JSON.parse(data.data);
          const i = this.newlist.findIndex(
            (obj) => obj.conversationId == data.conversationId
          );
          if (!this.activeuser) {
            if (
              this.activeuser.conversationID == this.newlist[i].conversationID
            ) {
              this.activeuser = {};
            }
          }
          if (this.newlist[i].status == 'Requested') { this.newlist.splice(i, 1); }
        }
        this.convosService
          .getOngoingList(this.myprofile.userId)
          .subscribe((res: any) => {
            if (res.status && res.message.length > 0) {
              res.message.map((obj) => {
                return (obj.profile = this.colors[this.getRandom()]);
              });
              this.otherAgentConvos = res.message;
            }
          });
      }
    }),
      (err) => {};
    this.quickservice.getQuickresponses().subscribe((res: any) => {
      // console.log(this.cookie.get('recent'))

      this.nzOptions = res;
      if (this.cookie.get('recent').length > 0) {
        this.nzOptions.unshift(JSON.parse(this.cookie.get('recent')));
      }
      // console.log(this.nzOptions)
    });
    setTimeout(() => {
      this.loaderConvos = false;
      const id = localStorage.getItem('id');
      const i = this.ongoing.findIndex((obj) => obj.conversationID == id);
      if (i != -1) { this.activeuser = this.ongoing[i]; }
    }, 2000);
    setTimeout(() => {
      this.nzOptions = this.options;
    }, 100);
  }

  // changeNzOptions(): void {
  //   alert()
  //   if (this.nzOptions === options) {
  //     // this.nzOptions = otherOptions;
  //   } else {
  //     this.nzOptions = options;
  //   }
  // }

  onChanges(values: string[]): void {
    // alert(values)
    // console.log(values)
    this.values = '';
    this.message = values[values.length - 1];
    this.quickResponse = false;
    // var values

    // console.log(this.cookie.get('recent'))
    if (this.cookie.get('recent')) {
      this.recent = JSON.parse(this.cookie.get('recent'));
      const check = this.recent.children.findIndex(
        (obj) => obj.value == values[values.length - 1]
      );
      // console.log(check)
      if (check == -1) {
        this.recent.children.push({
          value: values[values.length - 1],
          label: values[values.length - 1],
          isLeaf: true,
        });
      }
      this.nzOptions.splice(0, 1);
      this.nzOptions.unshift(this.recent);
      // console.log("recent",this.recent)
      this.cookie.set('recent', JSON.stringify(this.recent));
    } else {
      this.recent.children.push({
        value: values[values.length - 1],
        label: values[values.length - 1],
        isLeaf: true,
      });
      this.nzOptions.unshift(this.recent);
      // console.log("recent",this.recent)
      this.cookie.set('recent', JSON.stringify(this.recent));
    }

    // console.log(values, this.message);
  }

  viewinfo() {
    this.viewTicket = true;
  }

  updateTicket(value) {
    this.isSpinning = true;
    (this.ticketForm.value.entryId = this.activeuser.incidentData.entryId),
      (this.ticketForm.value.accessToken = this.activeuser.incidentData.accessToken),
      (this.ticketForm.value.token = this.activeuser.incidentData.token),
      (this.ticketForm.value.incidentId = this.activeuser.incidentId),
      (this.ticketForm.value.dialogId = this.activeuser.dialogId),
      (this.ticketForm.value.conversationID = this.activeuser.conversationID);
    this.ticketForm.value.sapcause = null;
    this.ticketForm.value.resolution = null;

    const i = this.groups.findIndex(
      (obj: any) => obj.name == this.ticketForm.value.assignedgroup
    );
    if (i != -1) {
      this.ticketForm.value.groupid = this.groups[i].id;
    }
    const j = this.assigneeMembers.findIndex(
      (obj: any) => obj.name == this.ticketForm.value.assigned
    );
    if (j != -1) {
      this.ticketForm.value.assignedID = this.assigneeMembers[j].id;
    }
    const k = this.ownerMembers.findIndex(
      (obj: any) => obj.name == this.ticketForm.value.owner
    );
    if (k != -1) {
      this.ticketForm.value.ownerMemberID = this.ownerMembers[k].id;
    }
    const l = this.groups.findIndex(
      (obj: any) => obj.name == this.ticketForm.value.ownergroup
    );
    if (l != -1) {
      this.ticketForm.value.ownerGroupID = this.groups[l].id;
    }

    // if (this.ticketForm.value.resolution == null && this.ticketForm.value.sapcause == null && this.ticketForm.value.solution == null && this.ticketForm.value.taberror == null) {
    this.remedy.updateTicket(this.ticketForm.value).subscribe(
      (res) => {
        // console.log(res)

        this.isSpinning = false;
        if (value) {
          this.confirmModal = this.modal.confirm({
            nzTitle: 'Info',
            nzOkText: 'Ok',
            // nzIconType: "delete",
            // nzOkType: 'danger',
            // nzCancelText: "Cancel",
            nzContent: 'The ticket has been updated successfully.',
            nzOnOk: () =>
              new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
                this.ticketForm.reset();
                this.onviewInfo();
              }).catch(() => {
                this.isSpinning = false;
              }),
          });
        }
      },
      () => {
        this.isSpinning = false;
      }
    );
  }
  closeTicket() {
    if (this.ticketForm.value.categorization == 'Pending Classification') {
      this.modal.warning({
        nzTitle: 'Warning',
        nzContent: `Please can we have This ticket cannot be resolved with an 'Operational Categorization Tier 3' Of "Pending Classification". Please update that field before continuing`,
      });
    } else {
      this.isSpinning = true;
      (this.ticketForm.value.entryId = this.activeuser.incidentData.entryId),
        (this.ticketForm.value.accessToken = this.activeuser.incidentData.accessToken),
        (this.ticketForm.value.token = this.activeuser.incidentData.token),
        (this.ticketForm.value.incidentId = this.activeuser.incidentId);
      (this.ticketForm.value.dialogId = this.activeuser.dialogId),
        (this.ticketForm.value.conversationID = this.activeuser.conversationID);
      const i = this.groups.findIndex(
        (obj: any) => obj.name == this.ticketForm.value.assignedgroup
      );
      if (i != -1) {
        this.ticketForm.value.groupid = this.groups[i].id;
      }
      const j = this.assigneeMembers.findIndex(
        (obj: any) => obj.name == this.ticketForm.value.assigned
      );
      if (j != -1) {
        this.ticketForm.value.assignedID = this.assigneeMembers[j].id;
      }
      const k = this.ownerMembers.findIndex(
        (obj: any) => obj.name == this.ticketForm.value.owner
      );
      if (k != -1) {
        this.ticketForm.value.ownerMemberID = this.ownerMembers[k].id;
      }
      const l = this.groups.findIndex(
        (obj: any) => obj.name == this.ticketForm.value.ownergroup
      );
      if (l != -1) {
        this.ticketForm.value.ownerGroupID = this.groups[l].id;
      }
      this.ticketForm.value.solution = this.ticketForm.value.solution[0];
      this.remedy.closeTicket(this.ticketForm.value).subscribe((res) => {
        this.ticketForm.reset();
        this.onviewInfo();
        this.isSpinning = false;
        this.confirmModal = this.modal.confirm({
          nzTitle: 'Info',
          nzOkText: 'Ok',
          // nzIconType: "delete",
          // nzOkType: 'danger',
          // nzCancelText: "Cancel",
          nzContent: 'The ticket has been closed successfully.',
          nzOnOk: () =>
            new Promise((resolve, reject) => {
              setTimeout(Math.random() > 0.5 ? resolve : reject, 100);
            }).catch(() => {}),
        });
      });
    }
    // console.log(this.ticketForm.value, this.activeuser.incidentData)
  }

  transferTo(agent) {
    // console.log(agent, this.activeuser)
    const i = this.ongoing.findIndex(
      (obj) => obj.conversationID == this.activeuser.conversationID
    );
    // console.log("----------------------")

    if (i >= 0) { this.ongoing.splice(i, 1); }

    // console.log("this ongoing", this.ongoing)
    const data = {
      userId: this.activeuser.conversationID,
      agent: {
        id: agent.userid,
        name: agent.fullName,
      },
      fromagent: {
        id: this.myprofile.userId,
        name: this.myprofile.name,
      },
    };
    this.activeuser = {};
    this.convosService.transferConvo(data).subscribe((res) => {
      // console.log(res)
      setTimeout(() => {
        this.convosService
          .getOngoingList(this.myprofile.userId)
          .subscribe((res: any) => {
            if (res.status && res.message.length > 0) {
              res.message.map((obj) => {
                return (obj.profile = this.colors[this.getRandom()]);
              });
              this.otherAgentConvos = [];
              this.otherAgentConvos = res.message;
            }
          });
      }, 3000);
    });
  }

  transferRequest() {
    this.activeuser.transfer = true;
    const tempdata = {
      user: {
        name: this.myprofile.name,
        id: this.myprofile.userId,
      },
      channel: this.activeuser.channel,
      dialogId: this.activeuser.dialogId,
      conversationID: this.activeuser.conversationID,
      origin: 'agent',
      type: 'message',
      text:
        'Your request has been transfered to another agent - ' +
        this.activeuser.agent.name,
      botID: this.activeuser.mInsightsBotID,
      timestamp: Date.now(),
    };
    this.messagesService.sendMessage(tempdata).subscribe((res: any) => {
      // console.log("post data", res)
      this.myprofile.lastActive = Date.now();
    });
    const data = {
      userId: this.activeuser.conversationID,
    };
    this.convosService.transferAccept(data).subscribe((res) => {
      // console.log(res)
      setTimeout(() => {
        this.convosService
          .getOngoingList(this.myprofile.userId)
          .subscribe((res: any) => {
            if (res.status && res.message.length > 0) {
              res.message.map((obj) => {
                return (obj.profile = this.colors[this.getRandom()]);
              });
              this.otherAgentConvos = [];
              this.otherAgentConvos = res.message;
            }
          });
      }, 3000);
    });
  }
  // this.search = {
  //   name: null,
  //   email: null,
  //   channel: null,
  //   date: null
  // }
  handleOk(): void {
    this.isVisible = false;

    this.loaderConvos = true;
    this.activeuser = {};
    if (this.activetab == 'Closed') {
      this.convosService
        .searchConvo(this.search, 'Completed')
        .subscribe((res: any) => {
          // console.log(res)
          res.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          this.completed = res.filter((obj) => obj.status == 'Completed');
        });
    }
    if (this.activetab == 'Active') {
      this.convosService
        .searchConvo(this.search, 'Requested')
        .subscribe((res: any) => {
          // console.log(res)
          res.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          this.newlist = res.filter((obj) => obj.status == 'Requested');
        });
      this.convosService
        .searchConvo(this.search, 'otherAgentAccepted')
        .subscribe((res: any) => {
          // console.log(res)
          res.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          this.otherAgentConvos = res.filter(
            (obj) => obj.agent.id != this.myprofile.userId
          );
        });
    }
    this.convosService
      .searchConvo(this.search, this.myprofile.userId)
      .subscribe((res: any) => {
        // console.log(res)

        res.map((obj) => {
          return (obj.profile = this.colors[this.getRandom()]);
        });
        if (this.activetab == 'Active') {
          this.ongoing = res.filter((obj) => obj.status == 'Accepted');
        }
        if (this.activetab == 'Closed') {
          this.completed = res.filter((obj) => obj.status == 'Completed');
          this.abandoned = res.filter((obj) => obj.status == 'Abandoned');
        }
        if (this.activetab == 'Archived') {
          this.archive = res.filter((obj) => obj.status == 'Archived');
          this.starred = res.filter((obj) => obj.status == 'Starred');
        }
        this.loaderConvos = false;
      });
  }

  handleCancel(): void {
    this.loaderConvos = true;
    this.isVisible = false;

    this.reload();
  }

  onChange(result: Date[]): void {
    if (result.length > 0) {
      this.loaderConvos = true;
      this.activeuser = {};

      if (this.activetab == 'Closed') {
        this.convosService
          .searchConvo(this.search, 'Completed')
          .subscribe((res: any) => {
            // console.log(res)
            res.map((obj) => {
              return (obj.profile = this.colors[this.getRandom()]);
            });
            this.completed = res.filter((obj) => obj.status == 'Completed');
          });
      }
      if (this.activetab == 'Active') {
        this.convosService
          .searchConvo(this.search, 'Requested')
          .subscribe((res: any) => {
            // console.log(res)
            res.map((obj) => {
              return (obj.profile = this.colors[this.getRandom()]);
            });
            this.newlist = res.filter((obj) => obj.status == 'Requested');
          });
        this.convosService
          .searchConvo(this.search, 'otherAgentAccepted')
          .subscribe((res: any) => {
            // console.log(res)
            res.map((obj) => {
              return (obj.profile = this.colors[this.getRandom()]);
            });
            // console.log(res[0].agent.id,this.myprofile.userId)
            this.otherAgentConvos = res.filter(
              (obj) => obj.agent.id != this.myprofile.userId
            );
          });
      }
      this.convosService
        .searchConvo(this.search, this.myprofile.userId)
        .subscribe((res: any) => {
          // console.log(res)

          res.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          if (this.activetab == 'Active') {
            this.ongoing = res.filter((obj) => obj.status == 'Accepted');
          }
          if (this.activetab == 'Closed') {
            this.abandoned = res.filter((obj) => obj.status == 'Abandoned');
          }
          if (this.activetab == 'Archived') {
            this.archive = res.filter((obj) => obj.status == 'Archived');
            this.starred = res.filter((obj) => obj.status == 'Starred');
          }
          this.loaderConvos = false;
        });
    } else {
      this.reload();
    }
  }
  reload() {
    this.search = {
      name: null,
      email: null,
      channel: null,
      date: null,
    };
    this.activeuser = {};
    if (this.activetab == 'Active') {
      this.getOngoingList();
      this.getnewList();
    }
    if (this.activetab == 'Closed') {
      this.getCompleted();
      this.getAbandoned();
    }
    if (this.activetab == 'Archived') {
      this.getArchived();
      this.getStarred();
    }
    setTimeout(() => {
      this.loaderConvos = false;
    }, 2000);
  }

  selectedTab(tabName) {
    this.activetab = tabName;
    this.viewTicket = false;
  }

  getOngoingList() {
    this.convosService.getUserList(this.myprofile.userId, 'Accepted').subscribe(
      (res: any) => {
        if (res.status && res.message.length > 0) {
          res.message.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          this.ongoing = res.message;
          // console.log(this.ongoing)
        }
      },
      (err) => {}
    );
    this.convosService
      .getOngoingList(this.myprofile.userId)
      .subscribe((res: any) => {
        if (res.status && res.message.length > 0) {
          res.message.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });

          this.otherAgentConvos = res.message;
        }
      });
  }

  getnewList() {
    // console.log("try to get new reqs");

    this.convosService
      .getUserList(this.myprofile.userId, 'Requested')
      .subscribe(
        (res: any) => {
          // console.log("this.activeRequestCount",this.activeRequestCount)
          if (res.status && res.message.length > 0) {
            res.message.map((obj) => {
              return (obj.profile = this.colors[this.getRandom()]);
            });
            if (this.activeRequestCount == 0) {
              this.newlist = res.message;
              this.activeRequestCount = this.newlist.length;
              // this.RequestTone.play();
              // this.service.showNotification(
              //   'Live agent portal',
              //   'You have a new request'
              // );
              // this.blink('New request');
              // this.createNotification(
              //   'info',
              //   'New Request',
              //   'You have a new request',
              //   5000
              // );
            } else if (
              this.activeRequestCount != res.message.length &&
              res.message.length > this.activeRequestCount
            ) {
              this.newlist = res.message;
              this.activeRequestCount = this.newlist.length;
              // this.RequestTone.play();
              // this.service.showNotification(
              //   'Live agent portal',
              //   'You have a new request'
              // );
              // this.blink('New request');
              // this.createNotification(
              //   'info',
              //   'New Request',
              //   'You have a new request',
              //   5000
              // );
            }
          }
        },
        (err) => {}
      );
  }
  getCompleted() {
    this.convosService.getCompleted('Completed').subscribe((res: any) => {
      if (res.status && res.message.length > 0) {
        res.message.map((obj) => {
          return (obj.profile = this.colors[this.getRandom()]);
        });
        this.completed = res.message;
      }
    });
    this.convosService
      .getOngoingList(this.myprofile.userId)
      .subscribe((res: any) => {
        if (res.status && res.message.length > 0) {
          res.message.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });

          this.otherAgentConvos = res.message;
        }
      });
  }
  getAbandoned() {
    this.convosService
      .getUserList(this.myprofile.userId, 'Abandoned')
      .subscribe(
        (res: any) => {
          if (res.status && res.message.length > 0) {
            res.message.map((obj) => {
              return (obj.profile = this.colors[this.getRandom()]);
            });
            this.abandoned = res.message;
          }
        },
        (err) => {}
      );
  }
  getArchived() {
    this.convosService.getUserList(this.myprofile.userId, 'Archived').subscribe(
      (res: any) => {
        if (res.status && res.message.length > 0) {
          res.message.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          this.archive = res.message;
        }
      },
      (err) => {}
    );
  }
  getStarred() {
    this.convosService.getUserList(this.myprofile.userId, 'Starred').subscribe(
      (res: any) => {
        if (res.status && res.message.length > 0) {
          res.message.map((obj) => {
            return (obj.profile = this.colors[this.getRandom()]);
          });
          this.starred = res.message;
        }
      },
      (err) => {}
    );
  }

  // onScroll(event) {
  //   console.log(event)
  // }
}
