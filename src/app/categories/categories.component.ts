import { Component, OnInit, ViewChildren,ViewChild, QueryList, ElementRef,HostListener } from '@angular/core';
import { Category,CCategory } from './categoriesmodel';
import{CategoryService} from './categories.service';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';  
import { Router } from '@angular/router';
import {MatTableDataSource,MatPaginator,MatSort,MatSortHeader,MatInput} from '@angular/material';
@Component({
    selector: 'categories-component',
   templateUrl:'./categories.component.html',
    styleUrls:['./categories.component.css']
})

export class CategoriesComponent implements OnInit{
    searchdiv:boolean=true;
    adddiv:boolean=false;
    searchcode:string="";
    searchname:string="";
    CategoryCode:string="";
    CategoryName:string="";
    CategoryID:number=0;
    savehide:boolean=true;
    edithide:boolean=true;
    clrhide:boolean=true;
    cnlhide:boolean=true;
    public gridData:Category[];
    private sorted = false;
    isView:boolean=false;
    @ViewChildren('pages') pages: QueryList<any>;
    itemsPerPage = 10;
    numberOfVisiblePaginators = 5;
    numberOfPaginators: number;
    paginators: Array<any> = [];
    activePage = 1;
    firstVisibleIndex = 1;
    lastVisibleIndex: number = this.itemsPerPage;
    firstVisiblePaginator = 0;
    lastVisiblePaginator = this.numberOfVisiblePaginators;
    IsAdd=false;
    IsEdit=false;
    IsView=false;
    IsDelete=false;
    items:any[];
    color="";
    Msg="";
    lblshow=false;
    constructor(public _categoryService: CategoryService,private el: ElementRef,
       private router: Router) {
         this.gridData=[];
         this.items = this.mapItems(router.config[2].children); 
         }
         private mapItems(routes: any[], path?: string): any[] {
   
          return routes.map(item => {
              const result: any = {
                  text: item.text,
                  path: (path ? `${ path }/` : '') + item.path,
                  IsScreenAssigned: item.IsScreenAssigned
              };
    
              if (item.children) {
                  result.items = this.mapItems(item.children, item.path);
              }         
              return result;
          });
      }
    ngOnInit() 
    { 
      // if(this.items.length>0)
      // {
      //   this.items.forEach(element => {
      //     if(element.path=='categories' && element.IsScreenAssigned==false)
      //     {
      //       this.router.navigate(['home']);
      //     }
      //   });
      // }
      this.LoadData();
      var retrievedObject = localStorage.getItem('screendata');
     var parsedObject = JSON.parse(retrievedObject);
     this.IsAdd=parsedObject[0].IsAdd;
     this.IsEdit=parsedObject[0].IsEdit;
     this.IsView=parsedObject[0].IsView;
     this.IsDelete=parsedObject[0].IsDelete;
   
    }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort1: MatSort;
	 displayedColumns = ['CategoryID', 'CategoryCode', 'CategoryName'];
     dataSource;
    LoadData(){
      this._categoryService.getData().subscribe((s: Category[]) => {        
        if(s.length>0)
        {
          this.gridData=[];
          this.gridData = s;    
          this.dataSource= new MatTableDataSource(this.gridData); 
          this.dataSource.paginator = this.paginator;  
          this.dataSource.sort = this.sort1;
        }
        else{
          this.gridData=[];
          this.color="#8a0808";
          this.Msg="No Record(s) Found...";
          this.lblshow=true;
        } 
        if (this.gridData.length % this.itemsPerPage === 0) {
            this.numberOfPaginators = Math.floor(this.gridData.length / this.itemsPerPage);
          } else {
            this.numberOfPaginators = Math.floor(this.gridData.length / this.itemsPerPage + 1);
          }
          this.paginators=[];
          for (let i = 1; i <= this.numberOfPaginators; i++) {
            this.paginators.push(i);
          }         
      });   
      
    }
   
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  rowClicked(row: any): void {
    console.log(row);
  }
    public captureScreen()  
  {  
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }  
    Search(){
      if(this.searchcode==undefined ||this.searchcode==null)
      {
        this.searchcode="";
      }
      if(this.searchname==undefined ||this.searchname==null)
      {
        this.searchname="";
      }
      this._categoryService.SearchData(this.searchcode,this.searchname).subscribe((s: Category[]) => {
        if(s.length>0)
        {
          this.gridData=[];
          this.gridData = s;
          this.color="";
          this.Msg="";
          this.lblshow=false; 
        }
        else{
          this.gridData=[];
          this.color="#8a0808";
          this.Msg="No Record(s) Found...";
          this.lblshow=true;
        }
        if (this.gridData.length % this.itemsPerPage === 0) {
            this.numberOfPaginators = Math.floor(this.gridData.length / this.itemsPerPage);
          } else {
            this.numberOfPaginators = Math.floor(this.gridData.length / this.itemsPerPage + 1);
          }
          this.paginators=[];
          for (let i = 1; i <= this.numberOfPaginators; i++) {
            this.paginators.push(i);
          }         
      });   
    }
    Add()
    { 
        this.savehide=false;
        this.edithide=true;
        this.clrhide=false;
        this.cnlhide=false;
        this.isView=false;        
        this.adddiv=true; 
        this.searchdiv=false;
        this.Clear();
    }
    Cancel()
    {
        this.adddiv=false; 
        this.searchdiv=true; 
        this.savehide=true;
        this.edithide=true;
        this.clrhide=true;
        this.cnlhide=true;
        this.Clear();
    }
    Clear(){
        this.searchcode="";
        this.searchname="";
        this.CategoryCode="";
        this.CategoryName="";
        this.CategoryID=0;
        this.ServiceStatus="";
        this.lblshow=false;
    }
    SearchClear(){
        this.searchcode="";
        this.searchname="";
        this.ServiceStatus="";
        this.lblshow=false;
        this.LoadData();
    }
    View(categoryid:number)
    {
        this.adddiv=true;
        this.searchdiv=false;
        this.isView=true;
        this.savehide=true;
        this.edithide=true;
        this.clrhide=true;
        this.cnlhide=false;
        if(categoryid!=0)
        {
            this.gridData.forEach((data) => {
                if(data.CategoryID==categoryid)
                {
                    this.CategoryCode=data.CategoryCode;
                    this.CategoryName=data.CategoryName;
                    this.CategoryID=data.CategoryID;                   
                }
               
            });
        }
       
    }
    Edit(categoryid:number)
    { this.isView=false;
        this.adddiv=true;
        this.searchdiv=false;
        this.savehide=true;
        this.edithide=false;
        this.clrhide=false;
        this.cnlhide=false;
        if(categoryid!=0)
        {
            this.gridData.forEach((data) => {
                if(data.CategoryID==categoryid)
                {
                    this.CategoryCode=data.CategoryCode;
                    this.CategoryName=data.CategoryName;
                    this.CategoryID=data.CategoryID;                    
                }
                
            });
        }
       
    }
    Delete(categoryid:number)
    { 
        if(categoryid!=0)
        {
          this.category.CategoryCode=this.CategoryCode;
          this.category.CategoryName=this.CategoryName;
          this.category.CategoryID=categoryid;
          this.category.Status='Delete';
                    this._categoryService.PostData(this.category).
                    subscribe(data => {  
                    if (data == 1) 
                    {
                        this.adddiv=false; 
                        this.searchdiv=true;
                        this.Clear();
                      //this.ServiceStatus="Data Deleted Successfully...";
                      //this.lblshow=true;
                      this.color="#0b3a0f";
                      this.Msg="Data Deleted Successfully...";
                      this.lblshow=true;
                      this.LoadData();  
                    }  
                    else{
                      this.color="#8a0808";
                      this.Msg="Error Occured to delete the record...";
                      this.lblshow=true;
                    }   
                    });                   
              
        }
       
    }
    public ServiceStatus:string="";
   // lblshow=false;
    public category:Category=new CCategory();
    public Save(){
        if(this.CategoryCode !="" && this.CategoryName !="")
        {           
            this.category.CategoryCode=this.CategoryCode;
            this.category.CategoryName=this.CategoryName;
            this.category.CategoryID=this.CategoryID;
            this.category.Status='';
              this._categoryService.PostData(this.category).
                            subscribe(data => {  
                            if (data == 1) 
                            {
                                this.adddiv=false; 
                                this.searchdiv=true;
                                this.Clear();
                             // this.ServiceStatus="Data Inserted Successfully...";
                             // this.lblshow=true;
                                this.color="#0b3a0f";
                                this.Msg="Data Inserted Successfully...";
                                this.lblshow=true;
                                this.LoadData();   
                            } 
                            else{
                              this.color="#8a0808";
                              this.Msg="Error Occured to insert the record...";
                              this.lblshow=true;
                            }   
                            });
        }
    }
    Update(){
      if(this.CategoryCode !="" && this.CategoryName !="" &&this.CategoryID !=0)
      {           
          this.category.CategoryCode=this.CategoryCode;
          this.category.CategoryName=this.CategoryName;
          this.category.CategoryID=this.CategoryID;
          this.category.Status='Update';
            this._categoryService.PostData(this.category).
                          subscribe(data => {  
                          if (data == 1) 
                          {
                              this.adddiv=false; 
                              this.searchdiv=true;
                              this.Clear();                            
                              this.color="#0b3a0f";
                              this.Msg="Data Updated Successfully...";
                              this.lblshow=true;
                              this.LoadData();   
                          } 
                          else{
                            this.color="#8a0808";
                            this.Msg="Error Occured to update the record...";
                            this.lblshow=true;
                          }  
                          });
      }
    }
    sortBy(by: string | any): void {

        this.gridData.sort((a: any, b: any) => {
          if (a[by] < b[by]) {
            return this.sorted ? 1 : -1;
          }
          if (a[by] > b[by]) {
            return this.sorted ? -1 : 1;
          }
    
          return 0;
        });
    
        this.sorted = !this.sorted;
      }
      changePage(event: any) {
        if (event.target.text >= 1 && event.target.text <= this.numberOfPaginators) {
          this.activePage = +event.target.text;
          this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
          this.lastVisibleIndex = this.activePage * this.itemsPerPage;
        }
      }
    
      nextPage(event: any) {
        if (this.pages.last.nativeElement.classList.contains('active')) {
          if ((this.numberOfPaginators - this.numberOfVisiblePaginators) >= this.lastVisiblePaginator) {
            this.firstVisiblePaginator += this.numberOfVisiblePaginators;
          this.lastVisiblePaginator += this.numberOfVisiblePaginators;
          } else {
            this.firstVisiblePaginator += this.numberOfVisiblePaginators;
          this.lastVisiblePaginator = this.numberOfPaginators;
          }
        }
    
        this.activePage += 1;
        this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
        this.lastVisibleIndex = this.activePage * this.itemsPerPage;
      }
    
      previousPage(event: any) {
        if (this.pages.first.nativeElement.classList.contains('active')) {
          if ((this.lastVisiblePaginator - this.firstVisiblePaginator) === this.numberOfVisiblePaginators)  {
            this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
            this.lastVisiblePaginator -= this.numberOfVisiblePaginators;
          } else {
            this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
            this.lastVisiblePaginator -= (this.numberOfPaginators % this.numberOfVisiblePaginators);
          }
        }
    
        this.activePage -= 1;
        this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
        this.lastVisibleIndex = this.activePage * this.itemsPerPage;
      }
    
      firstPage() {
        this.activePage = 1;
        this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
        this.lastVisibleIndex = this.activePage * this.itemsPerPage;
        this.firstVisiblePaginator = 0;
        this.lastVisiblePaginator = this.numberOfVisiblePaginators;
      }
    
      lastPage() {
        this.activePage = this.numberOfPaginators;
        this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
        this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    
        if (this.numberOfPaginators % this.numberOfVisiblePaginators === 0) {
          this.firstVisiblePaginator = this.numberOfPaginators - this.numberOfVisiblePaginators;
          this.lastVisiblePaginator = this.numberOfPaginators;
        } else {
          this.lastVisiblePaginator = this.numberOfPaginators;
          this.firstVisiblePaginator = this.lastVisiblePaginator - (this.numberOfPaginators % this.numberOfVisiblePaginators);
        }
      }
}
