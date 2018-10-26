import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Items,CategoryList } from './itemsmodel';
import{NgForm} from '@angular/forms';
import{ItemsService} from './items.service';
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf-autotable';
import { Router } from '@angular/router';
@Component({
    selector: 'items-component',
   templateUrl:'./items.component.html',
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
  
  .btn-success:hover {
    color: #fff !important;
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
     .validate:disabled, .validate[readonly] {
       background-color: #e9ecef;
      opacity: 1;
  }
  `]
})

export class ItemsComponent implements OnInit{
    searchdiv:boolean=true;
    adddiv:boolean=false;
    searchcode:string="";
    searchname:string="";
    searchcategory:string="";
    savehide:boolean=true;
    edithide:boolean=true;
    clrhide:boolean=true;
    cnlhide:boolean=true;
    public gridData:Items[]=[];
   
    isView:boolean=false;
    private sorted = false;
    @ViewChildren('pages') pages: QueryList<any>;
    itemsPerPage = 10;
    numberOfVisiblePaginators = 10;
    numberOfPaginators: number;
    paginators: Array<any> = [];
    categories:CategoryList[];
    activePage = 1;
    firstVisibleIndex = 1;
    lastVisibleIndex: number = this.itemsPerPage;
    firstVisiblePaginator = 0;
    lastVisiblePaginator = this.numberOfVisiblePaginators;
    IsAdd=false;
    IsEdit=false;
    IsView=false;
    IsDelete=false;
    items1:any[];
    color="";
    Msg="";
    lblshow=false;
    constructor(public _itemService: ItemsService,private el: ElementRef, private router: Router) {
      this.items1 = this.mapItems(router.config[2].children); 
     }//
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
      // if(this.items1.length>0)
      // {
      //   this.items1.forEach(element => {
      //     if(element.path=='items' && element.IsScreenAssigned==false)
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
    Print(){     
      // this._itemService.Generate().subscribe((s: string) => {
      //   window.open("http://localhost:59129/SamplesPDF/"+s,"target:_blank");
       
      // });
    //   var data = document.getElementById('contentToConvert');  
    // html2canvas(data).then(canvas => {  
    //   // Few necessary setting options  
    //   var imgWidth = 208;   
    //   var pageHeight = 295;    
    //   var imgHeight = canvas.height * imgWidth / canvas.width;  
    //   var heightLeft = imgHeight;  
  
    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   let pdf = new jspdf('p', 'pt', 'letter'); // A4 size page of PDF  
    //   var position = 0;  
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    // }); 
   
    // html2canvas(document.getElementById('contentToConvert')).then(function(canvas) {
      
    //   var doc = new jspdf('p', 'pt', 'letter');
    //   doc.textAlign('center');
    //   doc.text(20, 20, 'Agility E Services Pvt Ltd');    
    //   doc.text(20, 40, 'Items');      
    //   doc.addPage();
    //   doc.text(20, 20, 'http://www.coding4developers.com/');
    //   var img = canvas.toDataURL("image/png");
     
    //   doc.save('test.pdf');
    // });
    var doc = new jsPDF('p', 'pt');
  var res = doc.autoTableHtmlToJson(document.getElementById('contentToConvert'));
  var height = doc.internal.pageSize.height;
  doc.text("text", 50, 50);
  doc.autoTable(res.columns, res.data, {
    startY: 200
  });
  doc.autoTable(res.columns, res.data, {
    startY: doc.autoTableEndPosY() + 50
  });
  doc.autoTable(res.columns, res.data, {
    startY: height,
    afterPageContent: function(data) {
      doc.setFontSize(20)
      doc.text("After page content", 50, height - data.settings.margin.bottom - 20);
    }
  });
  doc.save('table.pdf');
    }
    LoadData(){
      this._itemService.getData().subscribe((s: Items[]) => {
          if(s.length>0)
          {
            this.gridData=[];
            this.gridData = s; 
          }
          else{
            this.gridData=[];
            this.color="#8a0808";
             this.Msg="No Record(s) found..";
             this.lblshow=true;
          }
      
       if(this.gridData !=undefined)
       {
        if (this.gridData.length % this.itemsPerPage === 0) {
            this.numberOfPaginators = Math.floor(this.gridData.length / this.itemsPerPage);
          } else {
            this.numberOfPaginators = Math.floor(this.gridData.length / this.itemsPerPage + 1);
          }
          this.paginators=[];
          for (let i = 1; i <= this.numberOfPaginators; i++) {
            this.paginators.push(i);
          } 
       }
                
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
      if(this.searchcategory==undefined ||this.searchcategory==null)
      {
        this.searchcategory="";
      }
      this._itemService.SearchData(this.searchcode,this.searchname,this.searchcategory).subscribe((s: Items[]) => {
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
          this.Msg="No Record(s) found..";
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
    {  this._itemService.getCategories().subscribe((s: CategoryList[]) => {
        this.categories = s; 
     });
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
        this.searchcategory="";
        this.items={ItemID:0,ItemCode:'',ItemName:'',CategoryID:0,CategoryName:'',ItemPrice:0,CGST:0,IGST:0,SGST:0,TotalGST:0,MinQuantity:0,MaxQuantity:0,Discount:0,Status:''};
        this.ServiceStatus="";
        this.lblshow=false;        
    }
    SearchClear(){
        this.searchcode="";
        this.searchname="";
        this.ServiceStatus="";
        this.searchcategory="";
        this.lblshow=false;
        this.LoadData();
    }
    optionSelected: any=[{CategoryID:0,CategoryCode:'',CategoryName:'Select Category'}];
    View(itemid:number)
    {
        this.adddiv=true;
        this.searchdiv=false;
        this.isView=true;
        this.savehide=true;
        this.edithide=true;
        this.clrhide=true;
        this.cnlhide=false;
        if(itemid!=0)
        {
            this.gridData.forEach((data) => {
                if(data.ItemID==itemid)
                {
                    this._itemService.getCategories().subscribe((s: CategoryList[]) => {                        
                        this.categories = s;                         
                     });
                    this.items=data;
                    
                }
               
            });
        }
       
    }
    Edit(itemid:number)
    { this.isView=false;
        this.adddiv=true;
        this.searchdiv=false;
        this.savehide=true;
        this.edithide=false;
        this.clrhide=false;
        this.cnlhide=false;
        if(itemid!=0)
        {
            this.gridData.forEach((data) => {
                if(data.ItemID==itemid)
                {
                    this._itemService.getCategories().subscribe((s: CategoryList[]) => {                        
                        this.categories = s;                         
                     });   
                    this.items=data;
                   return false;                 
                }               
            });
        }
       
    }
    Delete(itemid:number)
    { 
        if(itemid!=0)
        {         
          this.items.Status='Delete';
                    this._itemService.PostData(this.items).subscribe(data => {  
                    if (data ==1) 
                    {
                        this.adddiv=false; 
                        this.searchdiv=true;
                        this.Clear();
                        this.color="#0b3a0f";
                        this.Msg="Data Deleted Successfully...";
                        this.lblshow=true;
                        this.LoadData();
                    }else{
                      
                      this.color="#8a0808";
                        this.Msg="Error Occured to delete the record...";
                        this.lblshow=true; 
                    }   
                   });                   
              
        }
       
    }
    public ServiceStatus:string="";
    //lblshow=false;
    public items:Items=new Items();
    public Save(){
        if(this.items !=null)
        {  
            this.items.Status='';
              this._itemService.PostData(this.items).subscribe(data => {  
                            if (data ==1) 
                            {
                                this.adddiv=false; 
                                this.searchdiv=true;
                                this.Clear();
                              //this.ServiceStatus="Data Inserted Successfully...";
                              //this.lblshow=true;
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
    CategoryID=0;
    onSelect(catid){
        this.CategoryID=catid;
        this.items.CategoryID=parseInt(catid);      
      }
    Update(){
      if(this.items !=null && this.items.ItemID !=0)
      {           
         
          this.items.Status='Update';
            this._itemService.PostData(this.items).subscribe(data => {  
                if (data ==1)
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
    UpdateGST(value:any,coltype:string)
    {
      if(coltype=='IGST')
      {
        this.items.IGST=value;
        this.items.CGST=0;
        this.items.SGST=0;
        this.items.TotalGST=this.items.IGST;
      }
      else if(coltype=='SGST')
      {
        this.items.IGST=0;
        this.items.SGST=value;
        this.items.TotalGST=this.items.CGST+this.items.SGST;
      }
      else if(coltype=='CGST')
      {
        this.items.IGST=0;
        this.items.CGST=value;
        this.items.TotalGST=this.items.CGST+this.items.SGST;
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
