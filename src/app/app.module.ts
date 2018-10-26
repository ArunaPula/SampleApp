import { NgModule, NO_ERRORS_SCHEMA,Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//import { APP_BASE_HREF } from '@angular/common';
//import {ToasterModule, ToasterService} from 'angular2-toaster';
import {ToastaModule} from 'ngx-toasta';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule} from "@angular/http";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import {MatAutocompleteModule,MatNativeDateModule,MatInputModule,MatButtonModule, 
   MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule,MatTableModule,
   MatPaginatorModule,MatSortModule,MatFormFieldModule,MatDatepickerModule} from '@angular/material';
//import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgDatepickerModule } from 'ng2-datepicker';
import { GridModule,PDFModule , ExcelModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import {ShContextMenuModule} from 'ng2-right-click-menu';
import { AppComponent } from './app.component';
import { CityPipe } from './app.pipe';
import { CategoryPipe } from './categories/categories.pipe';
import { RouterModule } from '@angular/router';
import { MenuModule } from '@progress/kendo-angular-menu';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
//import { SidebarModule } from 'ng-sidebar';
import { DataTableModule,AccordionModule,ButtonModule,RadioButtonModule } from 'primeng/primeng';
import { AppService } from './app.service';
import{CategoryService} from './categories/categories.service';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './home/cities.component';
import { InfoComponent } from './home/info.component';
import { AboutComponent } from './about.component';
import { TeamComponent } from './home/team.component';
import { EmpComponent } from './home/emps.component';
import{ScheduleComponent} from './home/schedule.component';
import{TableComponent} from './home/mdbtable.component';
import{LoginComponent} from './Login/login.component';
import{CategoriesComponent} from './categories/categories.component';
import{ItemsComponent} from './items/items.component';
import{PurchaseOrderComponent} from './purchase/purchaseorder.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { MDBBootstrapModule,NavbarModule, WavesModule} from 'angular-bootstrap-md';
import{CustomDirectives} from './customdir.directive';
import {TableModule} from 'primeng/table';
import { UserComponent } from './user/user.component';
import{LoginService} from './Login/login.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ItemsService } from './items/items.service';
import{PurchaseService} from './purchase/purchase.service';
import { NotificationAlertDirective } from './notification-alert.directive';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { LockComponent } from './user/lock.component';
import { UserServiceService } from './user/user-service.service';
import { NotfoundComponent } from './notfound.component';
import{AdminComponent} from './home/admin.component';
     //accordion and accordion tab
//import {MenuItem} from 'primeng/api';
//import {WebStorageModule, LocalStorageService} from "angular2-localstorage";


// const routes = [
//   { path: '', component: HomeComponent, text: 'Home' },
//   { path: 'emps', component: EmpComponent, text: 'Employees' },
//   { path: 'cities', component: CityComponent, text: 'Cities' },
//   { path: 'schedule', component: ScheduleComponent, text: 'Schedule' },
//   { path: 'mdbtable', component: TableComponent, text: 'MDB Table' },
//   { path: 'Login/login', component: LoginComponent, text: 'Login' },];
//   {
//       path: 'info',
//       component: InfoComponent,
//       text: 'Info',
//       children: [
//           { path: 'about', component: AboutComponent, text: 'About' },
//           { path: 'team', component: TeamComponent, text: 'Team' }
//       ]
//   }
 

const  routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }, 
  //{ path: '**', component: HomeComponent }, 
  { path: 'home',
    component: HomeComponent, canActivate:[AuthGuard],  
    children: [{ path: '', redirectTo: 'home', pathMatch: 'full',text: 'Home' },
      { path: 'emps', component: EmpComponent,
       text: 'Employees',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
      { path: 'cities', component: CityComponent,
       text: 'Cities',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
      { path: 'schedule', component: ScheduleComponent, 
      text: 'Schedule',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
      { path: 'mdbtable', component: TableComponent,
      text: 'MDB Table',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
      { path: 'categories', component: CategoriesComponent, 
      text: 'Categories',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
      { path: 'items', component: ItemsComponent, 
      text: 'Items',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
      { path: 'purchaseorder', component: PurchaseOrderComponent, 
      text: 'Purchase Order',IsScreenAssigned:false,IsAdd:false,IsEdit:false,IsView:false,IsDelete:false },
    ]
  },
  {
    path: 'lock', component: LockComponent//, pathMatch: 'full'
  },
  { path: '404',  component: NotfoundComponent },
  { path: '**',  redirectTo:'404' }
]

@NgModule({
   bootstrap:    [AppComponent],
   declarations: [AppComponent,CityPipe,CategoryPipe,HomeComponent,CityComponent,InfoComponent,
    AboutComponent,TeamComponent,EmpComponent,ScheduleComponent,TableComponent,LockComponent,NotfoundComponent,
    LoginComponent,CustomDirectives,CategoriesComponent,ItemsComponent,PurchaseOrderComponent, 
    UserComponent, NotificationAlertDirective, AlertMessageComponent,AdminComponent],
   imports:      [BrowserModule, 
    BrowserAnimationsModule,HttpModule, GridModule,
                  ShContextMenuModule,FormsModule,MatInputModule,MatDatepickerModule,
                  ReactiveFormsModule,NgbModule,
                  NgDatepickerModule,//SidebarModule.forRoot(),
                  CommonModule, MatButtonModule,MatToolbarModule,
                  MatTableModule,MatPaginatorModule,MatSortModule,MatFormFieldModule,
                   MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule,
                  MatAutocompleteModule, InputsModule,HttpClientModule,
                   MenuModule,//WebStorageModule,
                   //FormGroup, FormBuilder, Validators,
                  RouterModule.forRoot(routes, { useHash: true }),AccordionModule, ToastaModule.forRoot(),
                  //PanelModule,
                  ButtonModule,TableModule,DropDownsModule,
                  RadioButtonModule,DataTableModule,//MenuItem,
                  PDFModule,ExcelModule,MDBBootstrapModule.forRoot(),NavbarModule, WavesModule,
                   LayoutModule
                  ],
                  
                  schemas: [
                    NO_ERRORS_SCHEMA
                ],
                exports: [ CommonModule, MatButtonModule,MatPaginatorModule,MatSortModule,
                  MatFormFieldModule, MatToolbarModule,MatTableModule, MatNativeDateModule, 
                  MatIconModule, MatSidenavModule, MatListModule,RouterModule,MatDatepickerModule ],
                providers: [AppService,CategoryService,LoginService,UserServiceService,PurchaseService,ItemsService,AuthGuard,
                  {
                    provide : HTTP_INTERCEPTORS,
                    useClass : AuthInterceptor,
                    multi : true
                  }]//,LocalStorageService
})

export class AppModule {
}