import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from "@angular/common";
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
//ng-zorro modules
import { IconDefinition } from '@ant-design/icons-angular';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { ChatComponent } from './components/chat/chat.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { UsermanagementComponent } from './components/usermanagement/usermanagement.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { EmailPipe } from './pipes/email.pipe';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { SseserviceService } from '../app/services/sseservice.service';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { MessagePipe } from './pipes/message.pipe';
import { DateagoPipe } from './pipes/dateago.pipe';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { TokenInterceptor } from './services/token.interceptor';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { QuickResponseComponent } from './components/quick-response/quick-response.component';
import { UserStateComponent } from './components/user-state/user-state.component';
import { ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CookieService  } from "ngx-cookie-service";
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { ConvoPipe } from './pipes/convo.pipe';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { registerLocaleData } from '@angular/common';
import { NzResultModule } from 'ng-zorro-antd/result';
import { en_US,NZ_I18N, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { ErrorComponent } from './components/error/error.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])


@NgModule({
  declarations: [
    AppComponent,
    LeftMenuComponent,
    ChatComponent,
    HeaderComponent,
    LoginComponent,
    UsermanagementComponent,
    UserprofileComponent,
    EmailPipe,
    MessagePipe,
    DateagoPipe,
    QuickResponseComponent,
    UserStateComponent,
    ConvoPipe,
    ErrorComponent,
  ],
  imports: [
    DragDropModule,
    NzAlertModule,
    NzResultModule,
    CommonModule,
    NzSwitchModule,
    NzSpinModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NzDatePickerModule,
    NzAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzDividerModule,
    AppRoutingModule,
    NzIconModule.forRoot(icons),
    NzMenuModule,
    NzLayoutModule,
    NzSkeletonModule,
    NzButtonModule,
    NzRadioModule,
    NzCascaderModule,
    NzBreadCrumbModule,
    NzNotificationModule,
    NzTableModule,
    NzAvatarModule,
    NzDropDownModule,
    NzFormModule,
    NzEmptyModule,
    NzCardModule,
    NzTabsModule,
    NzGridModule,
    NzToolTipModule,
    NzTagModule,
    NzModalModule,
    NzCarouselModule,
    NzBadgeModule,
    NzPopoverModule,
    NzCollapseModule,
    NzPopconfirmModule,
    NzDrawerModule,
    NzInputModule
  ],
  providers: [ CookieService,

    {

    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },LoginComponent,ChatComponent,DateagoPipe,TokenInterceptor,HeaderComponent,UsermanagementComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
        