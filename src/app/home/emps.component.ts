import { Component, HostListener, ViewEncapsulation} from '@angular/core';
//import { animate, state, style, transition, trigger } from '@angular/animations';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { AppService } from '../app.service';
import { IEmployeesColOrder, IEmployeeList } from '../model';
@Component({
    selector: 'emp-component',
    templateUrl: './emps.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
    .content.popup {
      background-color: red;
      color: white;
      padding: 10px;
      display:none;
    }
  `]
})

export class EmpComponent {
    public gridData:IEmployeeList[];
    public columns=[];
    public griddatacolumns:IEmployeesColOrder[];
    public title="AES";
    public ShowPopup=false;      
    public IfClicked = false;
    public IfClicked1 = false;
    public searchText = '';   
   
    //context menu x and y values for position
    public contextmenuX = 0;
    public contextmenuY = 0;
    public contextmenuX1 = 0;
    public contextmenuY1 = 0;
    public pageSize = 10;
    public skip = 0;
    public data: Object[];
    public items: any[];    
    public anchor;
    public ServiceStatus:string; 
    //private show: boolean = false;    
    displayVar='none';
    displayVar1='none';
    //public anchor;
    public content;
    public show = false;
    constructor(public _appService: AppService) {     
      this._appService.getEmpColumnsOrder().subscribe((c: IEmployeesColOrder[]) => {
        this.griddatacolumns=c;
        this.griddatacolumns.forEach((data) => {
          if(data.IsChecked)
          {this.columns.push(data.ColumnName)}
          else{
            this.hideColumn(data.ColumnName);
          }
       
        });        
         
       });
      
    }
    ngOnInit() 
    {
        this._appService.getEmpList().subscribe((s: IEmployeeList[]) => {
        this.gridData = s;        
      });   
          
    }  
   
@HostListener('document:contextmenu', ['$event'])
onDocumentRightClick(event) 
    { 
      if(event.path[2].tagName=="TH") 
      {
      this.IfClicked=false;
      this.IfClicked=true;
      this.contextmenuX=event.clientX-50;
      this.contextmenuY=event.clientY-120;
      this.displayVar='block';
      
      }
      else{this.displayVar='none';}
    }
onRightClick(event) 
  {
    if(event.path[2].tagName=="TH") 
    {
      this.IfClicked=false;
      this.IfClicked=false;
      this.contextmenuX=event.clientX-50;
      this.contextmenuY=event.clientY-120;
      this.displayVar='block';
      event.stopPropagation(); 
    }
    else{this.displayVar='none';}
  }
 
public pageChange(event: PageChangeEvent): void {
  this.skip = event.skip;
  this.loadItems();
}

public gridView: GridDataResult;
public loadItems(): void { 
  this.gridView = {
      data: this.gridData.slice(this.skip, this.skip + this.pageSize),
      total: this.gridData.length
  };
}
public disableContextMenu(){
  this.IfClicked= false;
  this.displayVar='none';
  this._appService.PostEmpColumnsOrder(this.griddatacolumns).
  subscribe(data => {  
  if (data >= 1) 
  {
    this.ServiceStatus="Success";
  }   
  });
}

public onMouseEnter (e,col) 
{
  
      if(e.path[2].className=="k-header")
      {
          if(this.griddatacolumns.length>0)
          {      
            this.griddatacolumns.forEach((data) => 
            {
                if(e.path[3].cells.length >0)
                {
                   for(var c=0;c<e.path[3].cells.length;c++)
                    {
                      if(data.ColumnName==e.path[3].cells[c].innerText)
                        {
                            data.IndexNo=e.path[3].cells[c].cellIndex;                            
                        }
                    }
                  }
                });
            }
            this._appService.PostEmpColumnsOrder(this.griddatacolumns).
                            subscribe(data => {  
                            if (data >= 1) 
                            {
                              this.ServiceStatus="Success";
                            }   
                            });
        }     
}
public fileChange(event): FormData {
  const fileList: FileList = event.target.files;
  if (fileList.length > 0) {
      const file = fileList[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
     return formData;
  }
}
    
    public onMouseLeave (e,col) {
     
      if(e.path[2].className=="k-header")
      {
          if(this.griddatacolumns.length>0)
          {      
            this.griddatacolumns.forEach((data) => 
            {
                if(e.path[3].cells.length >0)
                {
                   for(var c=0;c<e.path[3].cells.length;c++)
                    {
                      if(data.ColumnName==e.path[3].cells[c].innerText)
                        {
                            data.IndexNo=e.path[3].cells[c].cellIndex;                            
                        }
                    }
                  }
                });
            }
            this._appService.PostEmpColumnsOrder(this.griddatacolumns).
                            subscribe(data => {  
                            if (data >= 1) 
                            {
                              this.ServiceStatus="Success";
                            }   
                            });
        }
    }
//context menu item checkbox value changed event
   public ValueChanged(ischecked:boolean,id:string):void
    {
        this.griddatacolumns.forEach((data) => {
          if(data.ColumnName==id)
          {
            data.IsChecked=ischecked;                    
            this.getshoworhide(id,ischecked);                                                                       
          }
        });             
    } 
   public hiddenColumns: string[] = [];
   public hideColumn(field: string): void
   {
      this.hiddenColumns.push(field);
      this.griddatacolumns.forEach((data) => { 
        if(data.ColumnName==field)
        {
          data.IsChecked=false;
        }
      });
   }
//show/hide grid columns based on column text     
    public getshoworhide(textc:string,checked:boolean):void
    {  
        if(textc && !checked)
        {
         this.hideColumn(textc);
        }
        else if(textc && checked)
        {
          //if column exists in columns array then remove the column
                  var i=0;
                  this.columns.forEach((data) => {
                    if(textc==data)
                    {                      
                      const index: number = this.columns.indexOf(data);
                      if (index !== -1) {
                          this.columns.splice(index, 1);
                      }              
                    }
                    else{i=1;}              
                  });
                   if(i==1)
                    {
                    this.columns.push(textc)  
                    }
          this.hiddenColumns.forEach((data) => {
            if(textc==data)
            {
              const index: number = this.hiddenColumns.indexOf(data);
              if (index !== -1) {
                  this.hiddenColumns.splice(index, 1);
              }  
            }
           });
           this.griddatacolumns.forEach((data) => { 
            if(data.ColumnName==textc)
            {
              data.IsChecked=true;
            }
          });
        }
      }
}
