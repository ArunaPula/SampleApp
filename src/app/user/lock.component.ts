import{ Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import{NgForm} from '@angular/forms';
import{UserServiceService} from './user-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';

@Component({
  selector: 'app-lock',
 template:`
  
 <ngx-toasta [position]="'top-center'"></ngx-toasta>
 <div class="container1" style="margin: 130px auto;">

     <div class="row">
         <div class="col s8 offset-s2" style="margin: 0px auto;">
             <div class="card grey lighten-2" style="margin: 0px auto;">

                 <div class="card-tabs">
                     <ul class="tabs tabs-fixed-width">
                         <li class="tab"><a>Unlock Screen</a></li>
                        
                     </ul>
                 </div>
                 <div class="card-content grey lighten-4">
                     <div>
                         <form class="col s12 white" #UserLockForm="ngForm" (ngSubmit)="OnSubmitLogin(Password)">

                            
                             <div class="row">
                                 <div class="input-field col s12">
                                     <i class="material-icons prefix">lock</i>
                                     <input type="password" class="validate" minlength="3" name="Password" #Password ngModel required>
                                     <label for="Password">Enter Password</label>
                                     <!-- <span style="color: red" *ngIf="!Password">Password should be min 3 chars</span> -->
                                 </div>

                             </div>
                             <div class="row">
                                 <div class="col s12">
                                     <button class="btn-large btn-submit btn-block" [disabled]="!UserLockForm.valid" type="submit">Submit</button>
                                 </div>
                             </div>

                         </form>
                     </div>
                    

                 </div>
             </div>
         </div>
     </div>


 </div>

 `
})
export class LockComponent {

    constructor(private _LoginService:UserServiceService,private toastaService:ToastaService, 
        private toastaConfig: ToastaConfig,private router: Router){
        this.toastaConfig.theme = 'material';
      }

  ngOnInit() {
  }
  OnSubmitLogin(password)
  {
if(password.value !=undefined)
{
    let username=localStorage.getItem('username');
this._LoginService.userAuthentication(username,password.value).subscribe((data : any)=>{
  if(data.access_token !=null && data !=null)
  {
    localStorage.setItem('userToken',data.access_token);
    localStorage.setItem('username',username);
    this.router.navigate(['home']);
  }
  else{let toastOptions:ToastOptions = {
          title: "",
          msg: "Invalid UserName or Password",
          showClose: true,
          timeout: 500,
          theme: 'default',
          onAdd: (toast:ToastData) => {
              //console.log('Toast ' + toast.id + ' has been added!');
          },
          onRemove: function(toast:ToastData) {
              //console.log('Toast ' + toast.id + ' has been removed!');
          }
      };
        this.toastaService.success(toastOptions);
    }
},
(err : HttpErrorResponse)=>{
  //this.isLoginError = true;
  let toastOptions:ToastOptions = {
    title: "",
    msg: "Invalid UserName or Password",
    showClose: true,
    timeout: 500,
    theme: 'default',
    onAdd: (toast:ToastData) => {
        //console.log('Toast ' + toast.id + ' has been added!');
    },
    onRemove: function(toast:ToastData) {
        //console.log('Toast ' + toast.id + ' has been removed!');
    }
};
  this.toastaService.success(toastOptions);

});
}
  }

}
