import{ Component, OnInit,ViewContainerRef } from '@angular/core';
import { AppService } from '../app.service';
import { ILoginList } from '../model';
import { Router } from '@angular/router';
import{NgForm} from '@angular/forms';
import{User,Roles} from './usermodel';
import{LoginService} from './login.service';
import { HttpErrorResponse } from '@angular/common/http';
import {ToastaService, ToastaConfig, ToastOptions, ToastData} from 'ngx-toasta';
//ng serve -oimport {LocalStorage, SessionStorage} from "angular2-localstorage/WebStorage";
@Component({selector:'login-app',
templateUrl:'./login.component.html',
styles:[`.form-dark .font-small {
  font-size: 0.8rem; }

.form-dark [type="radio"] + label,
.form-dark [type="checkbox"] + label {
  font-size: 0.8rem; }

.form-dark [type="checkbox"] + label:before {
  top: 2px;
  width: 15px;
  height: 15px; }

.form-dark .md-form label {
  color: #fff; }

.form-dark input[type=email]:focus:not([readonly]) {
  border-bottom: 1px solid rgb(223, 110, 18);
  -webkit-box-shadow: 0 1px 0 0 rgb(223, 110, 18);
  box-shadow: 0 1px 0 0 rgb(223, 110, 18); }

.form-dark input[type=email]:focus:not([readonly]) + label {
  color: #fff; }

.form-dark input[type=password]:focus:not([readonly]) {
  border-bottom: 1px solid rgb(223, 110, 18);
  -webkit-box-shadow: 0 1px 0 0 rgb(223, 110, 18);
  box-shadow: 0 1px 0 0 rgb(223, 110, 18); }
  input[type=email]:focus:not([readonly]) + label {
    color: #ca750c !important; 
}

input[type=email]:focus:not([readonly]) {
    border-bottom: 1px solid #ca750c !important;
    box-shadow: 0 1px 0 0 #ca750c !important; 
}
.form-dark input[type=password]:focus:not([readonly]) + label {
  color: #fff; }

.form-dark input[type="checkbox"] + label:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 17px;
  height: 17px;
  z-index: 0;
  border: 1.5px solid #fff;
  border-radius: 1px;
  margin-top: 2px;
  -webkit-transition: 0.2s;
  transition: 0.2s; }

.form-dark input[type="checkbox"]:checked + label:before {
  top: -4px;
  left: -3px;
  width: 12px;
  height: 22px;
  border-style: solid;
  border-width: 2px;
  border-color: transparent rgb(223, 110, 18) rgb(223, 110, 18) transparent;
  -webkit-transform: rotate(40deg);
  -ms-transform: rotate(40deg);
  transform: rotate(40deg);
  
  -webkit-transform-origin: 100% 100%;
  -ms-transform-origin: 100% 100%;
  transform-origin: 100% 100%; }

.form-dark .modal-header {
    border-bottom: none;
}
.btn-success{
  background-color: #ca750c !important;
}
.btn-success:hover {
  color: #fff !important;
  background-color: #ca750c !important;
  border-color: #ca750c !important;
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: 'auto',
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    margin: 'auto'
  }
  paper: {
    padding: 20,
    overflow: 'auto'
  }
  buttonsDiv: {
    textAlign: 'center',
    padding: 10
  }
  flatButton: {
    color: grey500
  }
  checkRemember: {
    style: {
      float: 'left',
      maxWidth: 180,
      paddingTop: 5
    },
    labelStyle: {
      color: grey500
    },
    iconStyle: {
      color: grey500,
      borderColor: grey500,
      fill: grey500
    }
  }
  loginBtn: {
    float: 'right'
  }
  btn: {
    background: '#4f81e9',
    color: white,
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13
  }
  btnFacebook: {
    background: '#4f81e9'
  }
  btnGoogle: {
    background: '#e14441'
  }
  btnSpan: {
    marginLeft: 5
  }
  .ttext {
    color: #dc590a !important;
}
  #outPopUp {
    position: absolute;
    width: 300px;
    height: 200px;
    z-index: 15;
    top: 50%;
    left: 50%;
    width:800px; margin:0 auto;
    
  }
  .form-control{
    border: 0px solid !important;
    border-bottom: 1px solid #ced4da !important;
    background-color:transparent !important; 
  }
  /* label color */
   .input-field label {
     color: #000;
   }
   /* label focus color */
   .input-field input[type=text]:focus + label {
     color: #000;
   }
   /* label underline focus color */
   .input-field input[type=text]:focus {
     border-bottom: 1px solid #000;
     box-shadow: 0 1px 0 0 #000;
   }
   /* valid color */
   .input-field input[type=text].valid {
     border-bottom: 1px solid #000;
     box-shadow: 0 1px 0 0 #000;
   }
   /* invalid color */
   .input-field input[type=text].invalid {
     border-bottom: 1px solid #000;
     box-shadow: 0 1px 0 0 #000;
   }
   /* icon prefix focus color */
   .input-field .prefix.active {
     color: #000;
   }
`]
})
export class LoginComponent implements OnInit{
  public user:User;
     public show1=true;
    //here happens the magic. `username` is always restored from the localstorage when you reload the site
    public gridData:ILoginList[];
    public email:string;     
  loading = false;
 public roles:Roles[];
    selectedrole = null;
    constructor(private appser:AppService,private _LoginService:LoginService,private toastaService:ToastaService, private toastaConfig: ToastaConfig,private router: Router){
      this.toastaConfig.theme = 'material';
      this.toastaService.default('Hi there');
      if (localStorage.getItem('userToken') != null) {
             this.router.navigate([ 'home' ]);
        }
        else{
          this.router.navigate([ 'login' ]);
        }
       
    }
    onSelect(roleid){
      this.selectedrole = null;
      this.user.RoleID=parseInt(roleid);
    for (var i = 0; i < this.roles.length; i++)
    {
      if (this.roles[i].Id == roleid) {
        this.selectedrole = this.roles[i];
      }
    }
    }
    ngOnInit()
    {
      this.Show('SignIn');
      this.resetForm();     
    }
    isLoginError : boolean = false;
    OnSubmit(form:NgForm)
    {      
      this._LoginService.registerUser(this.user).subscribe((data:any)=>{
        if(data.Succeeded==true)
        {
          let toastOptions:ToastOptions = {
            title: "",
            msg: "User Registered successfully !..",
            showClose: true,
            timeout: 5000,
            theme: 'default',
            onAdd: (toast:ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast:ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
          this.toastaService.success(toastOptions);
          this.resetForm(form);
        }
        else{
          let toastOptions:ToastOptions = {
            title: "",
            msg: "User Registration Failed !..",
            showClose: true,
            timeout: 5000,
            theme: 'default',
            onAdd: (toast:ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast:ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
          this.toastaService.success(toastOptions);
        }
      })
    }
    OnSubmitLogin(email,password)
    {
if(email.value !=undefined && password.value !=undefined)
{
  this._LoginService.userAuthentication(email.value,password.value).subscribe((data : any)=>{
    if(data.access_token !=null && data !=null)
    {
      localStorage.setItem('userToken',data.access_token);
      localStorage.setItem('username',email.value);
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
    this.isLoginError = true;
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
   resetForm(form?:NgForm)
   {
    this._LoginService.getRoles().subscribe((data: Roles[]) => {
      this.roles=data;
    });
     if(form ==undefined)
     {
      this.user={UserName:'',FirstName:'',LastName:'',Password:'',Email:'',RoleID:0};
     }
     else{
     form.reset();
     this.user={UserName:'',FirstName:'',LastName:'',Password:'',Email:'',RoleID:0};
     }
    
   }
    public password:string;
    show():boolean{
     return this.show1=true;
    }
    lblstatus:string;
    userexits:boolean=false;
    public Login():boolean
    {if(this.email ==""||this.email ==undefined){
      this.lblstatus="Please enter EmailID";
      this.userexits=true;
      return true;
    }
    else if(this.password ==""||this.password ==undefined){
      this.lblstatus="Please enter Password";
      this.userexits=true;
      return true;
    }
     else{ 
        //localStorage.setItem(key, 'Value');
        if(this.email !=""&& this.password !=""&&this.email !=undefined&&this.password !=undefined)
        {
			      this.loading = true;
            this.appser.getLoginDetails(this.email,this.password).subscribe((s: ILoginList[]) => {
                if(s !=null && s.length >0)
                {
                    this.loading = false;
                    this.userexits=false;
                    this.lblstatus="";
                    this.gridData = s;                     
                    localStorage.setItem('gridData', JSON.stringify(this.gridData));
                    this.router.navigate([ 'home' ]);
                    localStorage.setItem('PageHeader','Home');                  
                }
                else if(s==null || s.length ==0)
                {
                    this.gridData = s; 
                    this.lblstatus="Invalid Email Or Password";
                    this.userexits=true;
                    this.loading = false;
                   // localStorage.setItem('gridData', JSON.stringify(this.gridData));  
                   // localStorage.setItem('PageHeader','NotLoggedIn');  
                   return true;                   
                }
                      
              }); 
              return false;  
        }
      }

    }
    SignIn=false;
    SignUp=false;
    public Show(value:string){
      if(value=='SignIn')
      {
        this.SignIn=true;
        this.SignUp=false;
      }
      else if(value=='SignUp')
      {
        this.SignIn=false;
        this.SignUp=true;
      }

    }
}