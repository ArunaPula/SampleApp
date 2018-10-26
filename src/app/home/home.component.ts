import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { LoginService } from "../Login/login.service";
@Component({
    selector: 'home-component',
    templateUrl:'./home.component.html',
})

export class HomeComponent {
    public items: any[];
 public LoginName:string;
public BindHeader:string;
userClaims: any;
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
      this.slideout=false;
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
