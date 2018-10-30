import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { LoginService } from "../Login/login.service";
import {trigger, state, style, transition, animate} from '@angular/animations';
@Component({
    selector: 'home-component',
    templateUrl:'./home.component.html',
    animations: [
        trigger('slideInOut', [
          state('in', style({
            transform: 'translate3d(-100%,0px, 0px)'
          })),
          state('out', style({
            transform: 'translate3d(0, 0, 0)'
          })),
          transition('in => out', animate('400ms ease-in-out')),
          transition('out => in', animate('400ms ease-in-out'))
        ]),
        trigger('slideInOut1', [
            state('in', style({
              transform: 'translate3d(-100%,0px, 0px)'
            })),
            state('out', style({
              transform: 'translate3d(0, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
          ]),
          trigger('slideInOut2', [
            state('in', style({
              transform: 'translate3d(0px,0px, 0px)'
            })),
            state('out', style({
              transform: 'translate3d(0, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
          ])          
      ],
      styles:[`.sidenav-toggle1{
        margin-left: 188px;
      }
      .sidenav-togglehide{
        margin-left: 0px;
      }
      .cardmenu{
        margin-left: 151px;
      }
      .cardmenu-hide{
        margin-left: 0px;
      }
      `]
})

export class HomeComponent {
    public items: any[];
 public LoginName:string;
public BindHeader:string;
menuState:string = 'out';
HidemenuState:string = 'out';
sideclass:string='sidenav-toggle1';
hideMenu:string='block';
userClaims: any;
cardclass:string='cardmenu';
  constructor(private route: ActivatedRoute,private _LoginService:LoginService, private router: Router) {
    this.items = this.mapItems(router.config[2].children); 
    this._LoginService.getUserClaims().subscribe((data: any) => {
        this.userClaims = data;
        this.LoginName=data.FirstName+' '+data.LastName;
        if(this.userClaims.RoleScreens !=undefined && this.userClaims.RoleScreens !="undefined")
      {
          if(this.router.url === '/home')
          {
            this.BindHeader="Home";
          }
          else{
            this.BindHeader="Page";
          }
        
       let storedNames = this.userClaims.RoleScreens;       
        storedNames.forEach(element => {
            for(let i=0;i<this.items.length;i++)
            {
                if(element.ScreenName==this.items[i].text)
                {
                    this.items[i].IsScreenAssigned=true;
                    this.items[i].IsAdd=element.IsAdd;
                    this.items[i].IsEdit=element.IsEdit;
                    this.items[i].IsView=element.IsView;
                    this.items[i].IsDelete=element.IsDelete;
                }
            }
        });
     }
      })
      
  }
  toggleMenu() {
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.sideclass = this.sideclass === 'sidenav-toggle1' ? 'sidenav-togglehide' : 'sidenav-toggle1'; 
    this.cardclass = this.cardclass === 'cardmenu' ? 'cardmenu-hide' : 'cardmenu';   
  }
  hidemenu() {
    // 1-line if statement that toggles the value:
    this.HidemenuState = this.HidemenuState === 'out' ? 'in' : 'out';
    this.hideMenu = this.hideMenu === 'block' ? 'none' : 'block';
    }
LockScreen()
{
    let uname= localStorage.getItem('username');
    localStorage.clear();
    localStorage.setItem('username',uname);
    this.router.navigate([ 'lock' ]);
}
screendata:any[]=[];
slideout:boolean=false;
  public onSelect(item,text,add,edit,view,delet): void {
      if (!item.items) {
        localStorage.removeItem('screendata');
        this.BindHeader=text;
       // let screendata:any[]=null;
        this.screendata.push({IsAdd:add,IsEdit:edit,IsView:view,IsDelete:delet})
        localStorage.setItem('screendata', JSON.stringify(this.screendata));
      }     
  }

public Logout(){
    localStorage.removeItem('userToken');
    localStorage.clear();   
    this.router.navigate(['login']);
}
  // convert the routes to menu items.
  private mapItems(routes: any[], path?: string): any[] {
   
      return routes.map(item => {
          const result: any = {
              text: item.text,
              path: (path ? `${ path }/` : '') + item.path
          };

          if (item.children) {
              result.items = this.mapItems(item.children, item.path);
          }         
          return result;
      });
  }
}
