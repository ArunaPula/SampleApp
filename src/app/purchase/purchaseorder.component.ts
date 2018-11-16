import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { PurchaseService } from './purchase.service';
import { Items1,PurchaseOrderModel,PODetails,VendorList,POAttachments } from './purchaseordermodel';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import{ALertMsg} from '../model';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'purchaseorder-component',
  templateUrl: './purchaseorder.component.html'
  
})
export class PurchaseOrderComponent implements OnInit {
  //searchTerm : FormControl = new FormControl();
 // searchResult = [];

 //search fields
  searchdiv:boolean=true;
  adddiv:boolean=false;
  searchcode:string="";
  searchname:string="";

  //for order date
  date: {year: number, month: number};

  //control or crud buttons
  savehide:boolean=true;
  edithide:boolean=true;
  clrhide:boolean=true;
  cnlhide:boolean=true;

  public ItemsData:Array<Items1>=[]; //Popup of items data
  public ItemsDataCode:Array<string>=[]; //autocomplete for item code of Items data
  public ItemsDataName:Array<string>=[]; //autocomplete for item name of Items data
  public gridData:PurchaseOrderModel[]=[]; //Search Grid
  private girdsorted = false;
  isView:boolean=false;
  //search grid pagination
  @ViewChildren('girdpages') girdpages: QueryList<any>;
  girditemsPerPage = 10;
  girdnumberOfVisiblePaginators = 5;
  girdnumberOfPaginators: number;
  girdpaginators: Array<any> = [];
  girdactivePage = 1;
  girdfirstVisibleIndex = 1;
  girdlastVisibleIndex: number = this.girditemsPerPage;
  girdfirstVisiblePaginator = 0;
  girdlastVisiblePaginator = this.girdnumberOfVisiblePaginators;
  collapsed1:boolean=true;

  //popup of items grid pagination
  private sorted = false;
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
  
  //permissions for control or crud buttons
  IsAdd=false;
  IsEdit=false;
  IsView=false;
  IsDelete=false;

  podetails:PurchaseOrderModel=new PurchaseOrderModel(); //object or model data of PO
  LineItems:PODetails[]; //PO Details
  Documents:POAttachments[]; //PO Attachments
  showp:boolean=false;
  model;
  items1:any[];

  //component constructor
  constructor(private service: PurchaseService,//private _itemService:ItemsService,
    private calendar: NgbCalendar){     
      //this.items1 = this.mapItems(router.config[2].children); 
   this.SearchClear();
  }

  //get the routes from route module
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

//PO Empty Docs
EmptyDocuments()
{
  this.Documents=[];
    for(var i=0;i<5;i++)
    {
      this.Documents.push({PODocumentId:0,PurchaseOrderID:0,FileName:"",FilePath:"",File:null});
    }
}

//File Change event in Line Items Docs
fileChange(event:any,i:number)
{
    if(event.target.files.length>0)
    {
      this.Documents[i].FileName=event.target.files[0].name;
      this.Documents[i].FilePath=event.target.value;
      this.Documents[i].File=event.target.files;
      
      if(i==(this.Documents.length-1))
      {
        this.Documents.push({PODocumentId:0,PurchaseOrderID:0,FileName:"",FilePath:"",File:null});
      }
    }
}

//Doc delete for each item
DocumentDelete(value:any,i:number)
{
      if(value ==0 || value==undefined)
      {
        if(this.Documents.length==1)
        {        
          this.lblshow=true;
          this.color="#8a0808";
        this.Msg="Documents should not be Empty...!";
        //this.showp=true;
        }
        else{  
          this.lblshow=false;
          this.color="";
          this.Msg="";          
          this.showp=false;
          this.Documents.splice(i, 1);
        }
      }
      else if(value !=0)
      {

      }
  
}
  fileUrl:any;
  //Downloading the file from Docs tab
  DownloadFile(value:any,i:number)
  {
      if(value !="")
      {
        window.URL.revokeObjectURL("http://10.138.77.141:8011/"+value);
      // window.open("http://10.138.77.141:8011/"+value,"target:_blank");
        // this.fileUrl=this.sanitizer.bypassSecurityTrustResourceUrl("http://10.138.77.141:8011/"+value);
      }
  }

  //selected date of PO Date
  selectToday() {
    this.podetails.OrderDate1 = this.calendar.getToday();
  }
  showmodal=false;
  displayVar='none';
  searchText='';
  indexnumber:number=0;
  //Toggle the Popup
  showm(v:number)
  {
      this.indexnumber=v;
      if(this.showmodal==false)
      {
        this.showmodal=true;
        this.searchText="";
        this.displayVar='block';     
      }
      else if(this.showmodal==true)
      {
        this.showmodal=false;
        this.searchText="";
        this.displayVar='none';
      // this.LoadPopupData();
      }
 
  }
  GridItems:any[]=[];
  //Checkbox value changed event in Modal Popup
  public ValueChanged(ischecked:boolean,id:number):void
  {
      if(ischecked==true)
      {
        this.GridItems.push({ItemID:id,IsChecked:false,IndexNumber:0});
      }
      else if(ischecked==false)
      {
        let indexnumber;
        if(this.GridItems.indexOf({ItemID:id,IsChecked:false}) !=0)
        {
          indexnumber=this.GridItems.indexOf({ItemID:id,IsChecked:false});
          this.GridItems.splice(indexnumber,1);
        }
        else if(this.GridItems.indexOf({ItemID:id,IsChecked:true}) !=0)
        {
          indexnumber=this.GridItems.indexOf({ItemID:id,IsChecked:true});
          this.GridItems.splice(indexnumber,1);
        }
      }            
  } 
  //After Checkbox selected items in Modal Popup then Push the items into Line Items
  Ok(){
    if(this.GridItems.length>0)
    {
      let j=this.indexnumber;
      this.GridItems.forEach(element => {
        for(var i=0;i<this.ItemsData.length;i++)
        {
          if(element.ItemID==this.ItemsData[i].ItemID && element.IsChecked==false)
          {
            //this.LineItems[j].PurchaseOrderID=0;
            //this.LineItems[j].PODetailID=0;
            this.LineItems[j].ItemID=this.ItemsData[i].ItemID;
            this.LineItems[j].ItemCode=this.ItemsData[i].ItemCode;
            this.LineItems[j].ItemName=this.ItemsData[i].ItemName;
            this.LineItems[j].ItemPrice=this.ItemsData[i].ItemPrice;
            this.LineItems[j].CategoryName=this.ItemsData[i].CategoryName;
            this.LineItems[j].CGST=this.ItemsData[i].CGST;
            this.LineItems[j].SGST=this.ItemsData[i].SGST;
            this.LineItems[j].IGST=this.ItemsData[i].IGST;
            this.LineItems[j].Quantity=this.ItemsData[i].Quantity;
            this.LineItems[j].NetAmount=this.ItemsData[i].NetAmount;//.Quantity*this.ItemsData[i].ItemPrice;//this.gridData[i].NetAmount;
            this.LineItems[j].Discount=this.ItemsData[i].Discount;
            this.LineItems[j].IsActive=true;
            this.LineItems[j].IsDeleted=false;
            this.ItemsData[i].IsChecked=true;
            element.IsChecked=true;
            this.LineItems[j].IsChecked=this.ItemsData[i].IsChecked;
          
            this.CalculateTotalAmount();
            if(j==(this.LineItems.length-1))
            {
              this.LineItems.push({PurchaseOrderID:0,PODetailID:0,ItemID:0,ItemName:'',ItemCode:'',
              ItemPrice:0,CategoryName:'',CGST:0,SGST:0,IGST:0,Quantity:0,Discount:0,
              //DiscountPrice:0,
              NetAmount:0,IsChecked:false,IsActive:true,IsDeleted:false});
            }
            this.RemoveItems(this.ItemsData[i]);            
            j++; 
          }          
        }
      });
      this.showmodal=false;
      this.displayVar='none';
    }
  }
  one:boolean=true;
  two:boolean=false;
  three:boolean=false;

  //Showing the tabs
  showtab(value:number)
  {
        if(value==1)
        {
          this.one=true;
          this.two=false;
          this.three=false;
        }
        else if(value==2)
        {
          this.one=false;
          this.two=true;
          this.three=false;
        }
        else if(value==3)
        {
          this.one=false;
          this.two=false;
          this.three=true;
        }
        else{ this.one=true;
          this.two=false;
          this.three=false;}
  }

  //calculating final amount of total selected items
  public CalculateTotalAmount()
  {
    if(this.LineItems.length>0)
    {
      let totalcgs=0;
      let totalsgs=0;
      let totaligs=0;
      let totaldiss=0;
      let totalqty=0;
      let totalamnt=0;
      this.LineItems.forEach(element => {
        if(element.ItemID !=0)
        {
          totalcgs +=element.CGST;
          totalsgs +=element.SGST;
          totaligs +=element.IGST;
          totaldiss +=element.Discount;
          totalqty +=element.Quantity;
          totalamnt +=element.NetAmount;
        }
      });
      this.podetails.TotalCGST=totalcgs;
      this.podetails.TotalSGST=totalsgs;
      this.podetails.TotalIGST=totaligs;
      this.podetails.TotalDiscount=totaldiss;
      this.podetails.TotalQunatity=totalqty;
      this.podetails.TotalAmount=totalamnt;
    }
  }

  //life cycle hook
  ngOnInit() 
    {    
      this.LoadData(); 

      //assigning the user permissions for control buttons
     var retrievedObject = localStorage.getItem('screendata');
     var parsedObject = JSON.parse(retrievedObject);
     this.IsAdd=parsedObject[0].IsAdd;
     this.IsEdit=parsedObject[0].IsEdit;
     this.IsView=parsedObject[0].IsView;
     this.IsDelete=parsedObject[0].IsDelete;
     this.searchdiv=true;
     this.adddiv=false;       
    }

    //empty po deails
    GetEmptyLineitems()
    {
        this.LineItems=[];
        for(var i=0;i<5;i++)
        {
          this.LineItems.push({PurchaseOrderID:0,PODetailID:0,ItemID:0,ItemName:'',
          ItemCode:'',ItemPrice:0,CategoryName:'',CGST:0,SGST:0,IGST:0,Quantity:0,Discount:0,
          //DiscountPrice:0,
          NetAmount:0,IsChecked:false,IsActive:true,IsDeleted:false});
        }
     
    }

    //load search grid data
    LoadData(){     
          this.service.getData().subscribe((s: PurchaseOrderModel[]) => {
              if(s.length>0)
              {
                this.gridData=[];
                this.gridData = s;
              }
              else{
                this.showp=false;
                this.gridData=[];
                this.color="#8a0808";
                this.Msg="No Record(s) found...!";
                this.lblshow=true;
                this.showp=true;
              }
          
          if(this.gridData !=undefined)
          {
            if (this.gridData.length % this.girditemsPerPage === 0) {
                this.girdnumberOfPaginators = Math.floor(this.gridData.length / this.girditemsPerPage);
              } else {
                this.girdnumberOfPaginators = Math.floor(this.gridData.length / this.girditemsPerPage + 1);
              }
              this.girdpaginators=[];
              for (let i = 1; i <= this.girdnumberOfPaginators; i++) {
                this.girdpaginators.push(i);
              } 
          }
                    
        });   
    
    }
    //load popup items grid data
    LoadPopupData(){ 
      this.GridItems=[]; 
      this.ItemsData=[];    
      this.service.getItemsData().subscribe((s: Items1[]) => {
          if(s.length>0)
          {
            this.ItemsData = s; 
            if(this.ItemsData.length>0)
            {
              this.ItemsDataCode=[];
              this.ItemsDataName=[];
              this.ItemsData.forEach(element => {
                this.ItemsDataCode.push(element.ItemCode);
                this.ItemsDataName.push(element.ItemName);
              });
            }
          }
          else{
            this.ItemsData=[];
            this.ItemsDataCode=[];
              this.ItemsDataName=[];
          }
      
       if(this.ItemsData !=undefined)
       {
        if (this.ItemsData.length % this.itemsPerPage === 0) {
            this.numberOfPaginators = Math.floor(this.ItemsData.length / this.itemsPerPage);
          } else {
            this.numberOfPaginators = Math.floor(this.ItemsData.length / this.itemsPerPage + 1);
          }
          this.paginators=[];
          for (let i = 1; i <= this.numberOfPaginators; i++) {
            this.paginators.push(i);
          } 
       }
                
     });   
    
    }
    public vendors:Array<VendorList>;
    public dataCode: Array<string>;
    public dataName: Array<string>;

    //automcomplete even
    public valueChange(value: any,ind:number,colname:string): void {
      let indx:Items1;
      if(value=="")
      {
        this.LineItems[ind].ItemID=0;
        this.LineItems[ind].ItemCode="";
        this.LineItems[ind].ItemName="";
        this.LineItems[ind].ItemPrice=0;
        this.LineItems[ind].CategoryName="";
        this.LineItems[ind].CGST=0;
        this.LineItems[ind].SGST=0;
        this.LineItems[ind].IGST=0;
        this.LineItems[ind].Quantity=0;
        this.LineItems[ind].NetAmount=0;
        this.LineItems[ind].Discount=0;
        this.LineItems[ind].IsChecked=false;
        this.LineItems[ind].IsActive=true;
        this.LineItems[ind].IsDeleted=false;
        this.GridItems = this.GridItems.filter(item => item.IndexNumber !== (ind+1));
       // this.GridItems.splice(this.GridItems.indexOf(this.GridItems), 1);
        this.CalculateTotalAmount();
      }
      else{
        this.ItemsData.forEach((element,index) => {
          if(colname=='ItemCode')
          {
            let exits="";
            if(value==element.ItemCode)
            {
              for(var kk=0;kk<this.LineItems.length;kk++)
              {
                if(this.LineItems[kk].ItemID==element.ItemID)
                {
                  exits="exists";
                  break;
                }
                else{
                  exits="";
                }
              }
             if(exits=="")
             {
              this.LineItems[ind].ItemID=element.ItemID;
              this.LineItems[ind].ItemCode=element.ItemCode;
              this.LineItems[ind].ItemName=element.ItemName;
              this.LineItems[ind].ItemPrice=element.ItemPrice;
              this.LineItems[ind].CategoryName=element.CategoryName;
              this.LineItems[ind].CGST=element.CGST;
              this.LineItems[ind].SGST=element.SGST;
              this.LineItems[ind].IGST=element.IGST;
              this.LineItems[ind].Quantity=element.Quantity;
              this.LineItems[ind].NetAmount=element.NetAmount;//this.gridData[i].NetAmount;
              this.LineItems[ind].Discount=element.Discount;
              this.LineItems[ind].IsChecked=true;
              this.LineItems[ind].IsActive=true;
              this.LineItems[ind].IsDeleted=false;
              element.IsChecked=true;
              indx=element;
              this.GridItems.push({ItemID:element.ItemID,IsChecked:false,IndexNumber:(ind+1)});
              this.CalculateTotalAmount();
              if(ind==(this.LineItems.length-1))
            {
              this.LineItems.push({PurchaseOrderID:0,PODetailID:0,ItemID:0,ItemName:'',
              ItemCode:'',ItemPrice:0,CategoryName:'',CGST:0,SGST:0,IGST:0,Quantity:0,Discount:0,
              NetAmount:0,IsChecked:false,IsActive:true,IsDeleted:false});
            }
            this.RemoveItems(indx);
            return;
             }
             else{               
            this.LineItems[ind].ItemCode="";
              value="";
              this.lblshow=true;
              this.color="#8a0808";
             this.Msg="Item Already Exists.Please select other item";
              return;
             }
            }
          }
          else if(colname=='ItemName')
          {
            let exits="";
            if(value==element.ItemName)
            {
              for(var kk=0;kk<this.LineItems.length;kk++)
              {
                if(this.LineItems[kk].ItemID==element.ItemID)
                {
                  exits="exists";
                  break;
                }
                else{
                  exits="";
                }
              }
             if(exits=="")
             {
              this.LineItems[ind].ItemID=element.ItemID;
              this.LineItems[ind].ItemCode=element.ItemCode;
              this.LineItems[ind].ItemName=element.ItemName;
              this.LineItems[ind].ItemPrice=element.ItemPrice;
              this.LineItems[ind].CategoryName=element.CategoryName;
              this.LineItems[ind].CGST=element.CGST;
              this.LineItems[ind].SGST=element.SGST;
              this.LineItems[ind].IGST=element.IGST;
              this.LineItems[ind].Quantity=element.Quantity;
              this.LineItems[ind].NetAmount=element.NetAmount;//this.gridData[i].NetAmount;
              this.LineItems[ind].Discount=element.Discount;
              this.LineItems[ind].IsChecked=true;
              this.LineItems[ind].IsActive=true;
              this.LineItems[ind].IsDeleted=false;
              element.IsChecked=true;
              indx=element;
              this.GridItems.push({ItemID:element.ItemID,IsChecked:false,IndexNumber:(ind+1)});
              this.CalculateTotalAmount();
              if(ind==(this.LineItems.length-1))
            {
              this.LineItems.push({PurchaseOrderID:0,PODetailID:0,ItemID:0,ItemName:'',
              ItemCode:'',ItemPrice:0,CategoryName:'',CGST:0,SGST:0,IGST:0,Quantity:0,Discount:0,
              NetAmount:0,IsChecked:false,IsActive:true,IsDeleted:false});
            }
            this.RemoveItems(indx);
            return;
             }
             else{
              this.LineItems[ind].ItemName="";
              value="";
              this.lblshow=true;
              this.color="#8a0808";
             this.Msg="Item Already Exists.Please select other item";
              return;
             }
            }
          }
          else{
  
          }
          
        });
      }
  }

  //line item quantity change event
  public QuantityChange(value:any,inx:number)
  {
    if(value !="")
    {
      let totalcgst=((this.LineItems[inx].ItemPrice) * (this.LineItems[inx].CGST))/100;
      let totalsgst=((this.LineItems[inx].ItemPrice) * (this.LineItems[inx].SGST))/100;
      let totaligst=((this.LineItems[inx].ItemPrice) * (this.LineItems[inx].IGST))/100;
      let disprice=((this.LineItems[inx].ItemPrice) * (this.LineItems[inx].Discount))/100;
      let afterdis=this.LineItems[inx].ItemPrice-disprice;
      let netamnt=(afterdis+totalcgst+totalsgst+totaligst) * parseInt(value);
      this.LineItems[inx].Quantity=parseInt(value);
      this.LineItems[inx].NetAmount=netamnt;
      this.CalculateTotalAmount();
          }
    else{
      this.LineItems[inx].Quantity=0;
      this.LineItems[inx].NetAmount=0;
    }
  }

  //item data of quantity change event
  public PQuantityChange(value:any,inx:number)
  {
    if(value !="")
    {
      let totalcgst=((this.ItemsData[inx].ItemPrice) * (this.ItemsData[inx].CGST))/100;
      let totalsgst=((this.ItemsData[inx].ItemPrice) * (this.ItemsData[inx].SGST))/100;
      let totaligst=((this.ItemsData[inx].ItemPrice) * (this.ItemsData[inx].IGST))/100;
      let disprice=((this.ItemsData[inx].ItemPrice) * (this.ItemsData[inx].Discount))/100;
      let afterdis=this.ItemsData[inx].ItemPrice-disprice;
      let netamnt=(afterdis+totalcgst+totalsgst+totaligst) * parseInt(value);
      this.ItemsData[inx].Quantity=parseInt(value);
      this.ItemsData[inx].NetAmount=netamnt;
    }
    else{
      this.ItemsData[inx].Quantity=0;
      this.ItemsData[inx].NetAmount=0;
    }
  }

  //if selected items are exists in previous data then remove in auto complete
 public RemoveItems(indv:Items1)
 {
  this.ItemsDataCode.splice(this.ItemsDataCode.indexOf(indv.ItemCode), 1);
  this.ItemsDataName.splice(this.ItemsDataName.indexOf(indv.ItemName), 1);
 }

 //auto complete for selected item data
  public filterChange(filter: any,j:any,coltype:string): void {
    if(filter=="")
    {
      this.LineItems[j].ItemID=0;
      this.LineItems[j].ItemCode="";
      this.LineItems[j].ItemName="";
      this.LineItems[j].ItemPrice=0;
      this.LineItems[j].CategoryName="";
      this.LineItems[j].CGST=0;
      this.LineItems[j].SGST=0;
      this.LineItems[j].IGST=0;
      this.LineItems[j].Quantity=0;
      this.LineItems[j].NetAmount=0;
      this.LineItems[j].Discount=0;
      this.LineItems[j].IsChecked=false;
      this.LineItems[j].IsActive=true;
      this.LineItems[j].IsDeleted=false;
      this.GridItems = this.GridItems.filter(item => item.IndexNumber !== (j+1));
     // this.GridItems.splice(this.GridItems.indexOf(this.GridItems), 1);
      this.CalculateTotalAmount();
    }
    if(coltype=='ItemCode')
    {
      this.dataCode = this.ItemsDataCode.filter((s) => s.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }
    else if(coltype=='ItemName')
    {
      this.dataName = this.ItemsDataName.filter((s) => s.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
      }
       }
  public events: string[] = [];
  private log(event: string, arg: any): void {
    this.events.push(`${event} ${arg || ''}`);
}

//filter grid data based on the key values
    Search(){
      if(this.searchcode==undefined ||this.searchcode==null)
      {
        this.searchcode="";
      }
      if(this.searchname==undefined ||this.searchname==null)
      {
        this.searchname="";
      }
      this.service.SearchData(this.searchcode,this.searchname).subscribe((s: PurchaseOrderModel[]) => {
        if(s.length>0)
        {
          this.gridData=[];
          this.gridData = s; 
          this.color="";
          this.Msg="";
          this.lblshow=false;
          this.showp=false;
        }
        else{
          this.gridData=[];
          this.color="#8a0808";
          this.Msg="No Record(s) found...";
          this.lblshow=true;
          this.showp=true;
        }
        
        if (this.gridData.length % this.girditemsPerPage === 0) {
            this.girdnumberOfPaginators = Math.floor(this.gridData.length / this.girditemsPerPage);
          } else {
            this.girdnumberOfPaginators = Math.floor(this.gridData.length / this.girditemsPerPage + 1);
          }
          this.girdpaginators=[];
          for (let i = 1; i <= this.girdnumberOfPaginators; i++) {
            this.girdpaginators.push(i);
          }         
      });   
    }

    //add btn event
    Add()
    {
        this.savehide=false;
        this.edithide=true;
        this.clrhide=false;
        this.cnlhide=false;
        this.isView=false;        
        this.adddiv=true; 
        this.searchdiv=false;
        this.LoadPopupData();
        this.Clear();
    }

    //cancel button event 
    Cancel()
    {
        this.adddiv=false; 
        this.searchdiv=true; 
        this.savehide=true;
        this.edithide=true;
        this.clrhide=true;
        this.cnlhide=true;
        this.Clear();
        this.LoadData(); 
    }
    //clear btn event
    Clear(){    
        this.searchcode="";
        this.searchname="";
        this.Msg="";
        this.color="";
        this.lblshow=false; 
        this.showp=false;
        this.podetails.OrderNo = "";
        this.podetails.OrderDate1 = this.calendar.getToday();
        this.podetails.TotalAmount=0;
        this.podetails.TotalCGST=0;
        this.podetails.TotalDiscount=0;
        this.podetails.TotalIGST=0;
        this.podetails.TotalQunatity=0;
        this.podetails.TotalSGST=0;
        this.podetails.VendorID=0;
        this.podetails.PurchaseOrderID=0;
        this.GetEmptyLineitems();
        this.LoadVendorList();
        this.EmptyDocuments();
        this.one=true;
        this.two=false;
        this.three=false;
    }

    //load vendor masters data
    public LoadVendorList()
    {
      this.service.getVendors().subscribe((s: Array<VendorList>) => {
        if(s.length>0)
        {
          this.vendors=s;
        }
      });
    }

    //search clear btn event
    SearchClear(){
        this.searchcode="";
        this.searchname="";
        this.color="";
        this.Msg="";
        this.lblshow=false;
        this.showp=false;
        this.LoadData();
    }
    optionSelected: any=[{VendorID:0,VendorCode:'',VendorName:'Select Vendor'}];
    
    //view
    View(orderid:number)
    {
        this.adddiv=true;
        this.searchdiv=false;
        this.isView=true;
        this.savehide=true;
        this.edithide=true;
        this.clrhide=true;
        this.cnlhide=false;
        this.LineItems=null;
        this.LoadVendorList();
        if(orderid!=0)
        {
          this.LineItems=[];
          this.LineItems.length=0;         
            this.gridData.forEach((data) => {
              if(orderid==data.PurchaseOrderID){
                this.podetails.PurchaseOrderID =data.PurchaseOrderID;
                this.podetails.VendorID =data.VendorID;
                this.podetails.OrderNo =data.OrderNo;
                this.podetails.TotalCGST =data.TotalCGST;
                this.podetails.TotalIGST =data.TotalIGST;
                this.podetails.TotalSGST =data.TotalSGST;
                this.podetails.TotalDiscount =data.TotalDiscount;
                this.podetails.TotalQunatity =data.TotalQunatity;
                this.podetails.TotalAmount =data.TotalAmount;
                this.podetails.PurchaseOrderID =data.PurchaseOrderID;
                this.podetails.OrderDate1=this.calendar.getToday();
                let splitdate=data.OrderDate.split("-");
                this.podetails.OrderDate1.day=parseInt(splitdate[0]);
                this.podetails.OrderDate1.month=parseInt(splitdate[1]);
                this.podetails.OrderDate1.year=parseInt(splitdate[2]);
                this.LineItems = data.PODetails;
                this.Documents = data.POAttachments;  
                this.LoadVendorList();
              }                
            });
        }
       
    }
    //edit in grid data
    Edit(orderid:number)
    {      
      this.isView=false;
        this.adddiv=true;
        this.searchdiv=false;
        this.savehide=true;
        this.edithide=false;
        this.clrhide=false;
        this.cnlhide=false;
        this.LoadVendorList();
        if(orderid!=0)
        {
          this.LineItems=[];
          this.LineItems.length=0;
            this.gridData.forEach((data) => {
              if(orderid==data.PurchaseOrderID){
                this.podetails.PurchaseOrderID =data.PurchaseOrderID;
                this.podetails.VendorID =data.VendorID;
                this.podetails.OrderNo =data.OrderNo;
                this.podetails.TotalCGST =data.TotalCGST;
                this.podetails.TotalIGST =data.TotalIGST;
                this.podetails.TotalSGST =data.TotalSGST;
                this.podetails.TotalDiscount =data.TotalDiscount;
                this.podetails.TotalQunatity =data.TotalQunatity;
                this.podetails.TotalAmount =data.TotalAmount;
                this.podetails.OrderDate1=this.calendar.getToday();
                let splitdate=data.OrderDate.split("-");
                this.podetails.OrderDate1.day=parseInt(splitdate[0]);
                this.podetails.OrderDate1.month=parseInt(splitdate[1]);
                this.podetails.OrderDate1.year=parseInt(splitdate[2]);
                this.LineItems = data.PODetails;        
                this.Documents = data.POAttachments;  
                this.Documents.push({PODocumentId:0,PurchaseOrderID:data.PurchaseOrderID,FileName:"",FilePath:"",File:null});       
              }
            });
          
        }
        let k=0;
        if(this.LineItems.length>0)
        {         
          this.LineItems.forEach(element => {
            if(element.PODetailID==0)
            {
                k=1;
            }
            else{
              k=0;
            }
          });
        }
        if(k == 0)
        {
          this.LineItems.push({PurchaseOrderID:0,PODetailID:0,ItemID:0,ItemName:'',
          ItemCode:'',ItemPrice:0,CategoryName:'',CGST:0,SGST:0,IGST:0,Quantity:0,Discount:0,
          //DiscountPrice:0,
          NetAmount:0,IsChecked:false,IsActive:true,IsDeleted:false});
        }       
        this.LoadPopupData();
        if(this.ItemsData.length>0 && this.podetails.PODetails.length >0)
        {
          this.ItemsData.forEach(element => {
            for(var jj=0;jj<this.podetails.PODetails.length;jj++)
            {
              if(element.ItemID==this.podetails.PODetails[jj].ItemID)
              {
                element.IsChecked=true;
                this.GridItems.push({ItemID:element.ItemID,IsChecked:true,IndexNumber:0});
              }
            }
          });
        }
       
    }

    //delete selected data in grid
    Delete(orderid:number)
    {       
      this.color="";
      this.Msg="";
      this.lblshow=false;
      this.showp=false;
      //this.podetails=new PurchaseOrderModel();
      if(orderid!=0)
        {
          this.podetails.PurchaseOrderID=orderid;  
          this.podetails.OrderNo ="";
          this.podetails.OrderDate1=this.calendar.getToday();      
          this.podetails.Status='Delete'; 
                    this.service.PostData(this.podetails,[]).subscribe(data => {  
                    if (data > 0) 
                    {
                        this.adddiv=false; 
                        this.searchdiv=true;
                        this.Clear();
                        this.color="#0b3a0f";
                      this.Msg="Data Deleted Successfully...";
                      this.lblshow=true;
                      this.showp=true;
                      this.LoadData();   
                    }   
                   });                   
              
        }
       
    }
    
    //line item delete
    LineDelete(podetailid:number,delindx:number){
      this.showp=false;
      if(podetailid==0 && delindx !=null)
      {
        if(this.LineItems.length==1)
        {        
          this.lblshow=true;
          this.color="#8a0808";
         this.Msg="LineItems should not be Empty...";
         //this.showp=true;
        }
        else{  
          this.lblshow=false;
          this.color="";
          this.Msg="";          
          this.showp=false;
          this.LineItems.splice(delindx, 1);
        }   
          this.CalculateTotalAmount();   
          if(this.LineItems[delindx].ItemID !=0)
          {
            this.GridItems = this.GridItems.filter(item => item.ItemID !== (this.LineItems[delindx].ItemID));
            this.ItemsData.forEach(element => {
              if(this.LineItems[delindx].ItemID==element.ItemID)
              {
                element.IsChecked=false;
              }
            });
          } 
      }
      else if(podetailid !=0)
      {
        this.LineItems[delindx].IsActive=false;
        this.LineItems[delindx].IsDeleted=true;
        this.CalculateTotalAmount(); 
        this.lblshow=true;
        this.color="#0b3a0f";
       this.Msg="Item Deleted Successfully...";
      }
    }
   
    public NotificationData:ALertMsg=new ALertMsg();
    color="";
    Msg="";
    lblshow=false;
    public items:Items1;
    public Save(){
      this.showp=false;
        if(this.podetails !=null)
        {  
            this.podetails.Status='';
            this.podetails.OrderDate=this.podetails.OrderDate1.month+"/"+this.podetails.OrderDate1.day+"/"+this.podetails.OrderDate1.year;
            let POSdetails:PODetails[]=[];
            let poattachments:POAttachments[]=[];
            if(this.LineItems.length>0)
            {                  
                    for(var i=0;i<this.LineItems.length;i++)
                    {
                      if(this.LineItems[i].ItemID !=0)
                      {
                        if(this.LineItems[i].Quantity==0 || this.LineItems[i].Quantity==undefined)
                        {
                          this.color="#8a0808";
                          this.Msg="Please Enter Quantity For Line Item "+(i+1);
                          this.lblshow=true;
                          this.showp=true;
                          return false;
                        }
                        else{
                          this.color="";
                          this.Msg="";
                          this.lblshow=false;
                          this.showp=false;
                          //return false;
                          POSdetails.push(this.LineItems[i]);
                        }
                      }
                    }
            }
            if(this.Documents.length>0)
            {                  
                    for(var i=0;i<this.Documents.length;i++)
                    {
                      if(this.Documents[i].FileName !="")
                      {                        
                          poattachments.push(this.Documents[i]);
                      }
                    }
            }
            if(POSdetails.length==0)
            {
              this.color="#8a0808";
                          this.Msg="Please Enter Atleast one Line Item ";
                          this.lblshow=true;
                          this.showp=true;
                          return false;
            }
            else  if(POSdetails.length > 0){
              this.podetails.PODetails=POSdetails;
              if(poattachments.length>0)
              {
                this.podetails.POAttachments=poattachments;
              }
              else{
                this.podetails.POAttachments=[];
              }
              var formData1 = new FormData();
          if(this.Documents.length>0)
          {
            let files1=[];
            this.Documents.forEach(element => {
              if(element.FileName !="")
                  {
                    files1.push({File:element.File});
                  }
            });
                // for (var j = 0; j < files1.length; j++) {
                //   formData1.append("file[]", files1[j].File[0], files1[j].File[0].name);
                // }
          }
                    this.service.PostData(this.podetails,formData1).subscribe(data => {   
                            if (data > 0) 
                            {
                                this.adddiv=false; 
                                this.searchdiv=true;
                                this.Clear();
                                this.color="#0b3a0f";
                              this.Msg="Data Inserted Successfully...";
                              this.lblshow=true;
                              this.showp=true;
                              this.LoadData();  
                            }   
                            });
            }
           
        }
    }
    VendorID=0;
    VendorName='Select Vendor';
    onSelect(catid){
        this.VendorID=catid;
        this.podetails.VendorID=parseInt(catid);      
      }

      //update order details
    Update(){
      this.showp=false;
      if(this.podetails !=null && this.podetails.PurchaseOrderID !=0)
      {           
       // this.podetails.Status='';
        this.podetails.OrderDate=this.podetails.OrderDate1.month+"/"+this.podetails.OrderDate1.day+"/"+this.podetails.OrderDate1.year;
       // this.podetails.OrderDate1="";
        let POSdetails:PODetails[]=[];
        let poattachments:POAttachments[]=[];
        if(this.LineItems.length>0)
        {              
                for(var i=0;i<this.LineItems.length;i++)
                {
                  if(this.LineItems[i].ItemID !=0)
                  {
                    if(this.LineItems[i].Quantity==0 || this.LineItems[i].Quantity==undefined)
                    {
                      this.color="#8a0808";
                      this.Msg="Please Enter Quantity For Line Item "+(i+1);
                      this.lblshow=true;
                      this.showp=true;
                      return false;
                    }
                    else{
                      this.color="";
                      this.Msg="";
                      this.lblshow=false;
                      this.showp=false;
                      //return false;
                      POSdetails.push(this.LineItems[i]);
                    }
                  }
                }
        }
        if(this.Documents.length>0)
        {              
                for(var i=0;i<this.Documents.length;i++)
                {
                  if(this.Documents[i].FileName !="")
                  {                        
                      poattachments.push(this.Documents[i]);
                  }
                }
        }
        if(POSdetails.length==0)
        {
          this.color="#8a0808";
                      this.Msg="Please Enter Atleast one Line Item ";
                      this.lblshow=true;
                      this.showp=true;
                      return false;
        }else  if(POSdetails.length > 0){
          this.podetails.PODetails=POSdetails;
          if(poattachments.length>0)
          {
            this.podetails.POAttachments=poattachments;
          }
          else{
            this.podetails.POAttachments=[];
          }
          this.podetails.Status='Update';
          let formData: FormData = new FormData();
          if(this.Documents.length>0)
          {
            let files1=[];
            this.Documents.forEach(element => {
                 if(element.FileName !="")
                  {
                    files1.push({File:element.File});
                  }
            });
                // for (var j = 0; j < files1.length; j++) {
                //  // var blob = new Blob(files1[j]);
                //  // formData.append("file[]", files1[j].File[0], files1[j].File[0].name);
                // }
          }
                    this.service.PostData(this.podetails,formData).subscribe(data => {  
                if (data >0)
                          {
                              this.adddiv=false; 
                              this.searchdiv=true;
                              this.Clear();
                              this.color="#0b3a0f";
                            this.Msg="Data Updated Successfully...";
                            this.lblshow=true;
                            this.showp=true;
                            this.LoadData();  
                          }   
                          });
        }
        
      }
    }
    //#region Main Grid Pagination And Sorting
    girdsortBy(by: string | any): void {

        this.gridData.sort((a: any, b: any) => {
          if (a[by] < b[by]) {
            return this.girdsorted ? 1 : -1;
          }
          if (a[by] > b[by]) {
            return this.girdsorted ? -1 : 1;
          }
    
          return 0;
        });
    
        this.girdsorted = !this.girdsorted;
      }
      girdchangePage(event: any) {
        if (event.target.text >= 1 && event.target.text <= this.girdnumberOfPaginators) {
          this.girdactivePage = +event.target.text;
          this.girdfirstVisibleIndex = this.girdactivePage * this.girditemsPerPage - this.girditemsPerPage + 1;
          this.girdlastVisibleIndex = this.girdactivePage * this.girditemsPerPage;
        }
      }
    
      girdnextPage(event: any) {
        if (this.girdpages.last.nativeElement.classList.contains('active')) {
          if ((this.girdnumberOfPaginators - this.girdnumberOfVisiblePaginators) >= this.girdlastVisiblePaginator) {
            this.girdfirstVisiblePaginator += this.girdnumberOfVisiblePaginators;
          this.girdlastVisiblePaginator += this.girdnumberOfVisiblePaginators;
          } else {
            this.girdfirstVisiblePaginator += this.girdnumberOfVisiblePaginators;
          this.girdlastVisiblePaginator = this.girdnumberOfPaginators;
          }
        }
    
        this.girdactivePage += 1;
        this.girdfirstVisibleIndex = this.girdactivePage * this.girditemsPerPage - this.girditemsPerPage + 1;
        this.girdlastVisibleIndex = this.girdactivePage * this.girditemsPerPage;
      }
    
      girdpreviousPage(event: any) {
        if (this.girdpages.first.nativeElement.classList.contains('active')) {
          if ((this.girdlastVisiblePaginator - this.girdfirstVisiblePaginator) === this.girdnumberOfVisiblePaginators)  {
            this.girdfirstVisiblePaginator -= this.girdnumberOfVisiblePaginators;
            this.girdlastVisiblePaginator -= this.girdnumberOfVisiblePaginators;
          } else {
            this.girdfirstVisiblePaginator -= this.girdnumberOfVisiblePaginators;
            this.girdlastVisiblePaginator -= (this.girdnumberOfPaginators % this.girdnumberOfVisiblePaginators);
          }
        }
    
        this.girdactivePage -= 1;
        this.girdfirstVisibleIndex = this.girdactivePage * this.girditemsPerPage - this.girditemsPerPage + 1;
        this.girdlastVisibleIndex = this.girdactivePage * this.girditemsPerPage;
      }
    
      girdfirstPage() {
        this.girdactivePage = 1;
        this.girdfirstVisibleIndex = this.girdactivePage * this.girditemsPerPage - this.girditemsPerPage + 1;
        this.girdlastVisibleIndex = this.girdactivePage * this.girditemsPerPage;
        this.girdfirstVisiblePaginator = 0;
        this.girdlastVisiblePaginator = this.girdnumberOfVisiblePaginators;
      }
    
      girdlastPage() {
        this.girdactivePage = this.girdnumberOfPaginators;
        this.girdfirstVisibleIndex = this.girdactivePage * this.girditemsPerPage - this.girditemsPerPage + 1;
        this.girdlastVisibleIndex = this.girdactivePage * this.girditemsPerPage;
    
        if (this.girdnumberOfPaginators % this.girdnumberOfVisiblePaginators === 0) {
          this.girdfirstVisiblePaginator = this.girdnumberOfPaginators - this.girdnumberOfVisiblePaginators;
          this.girdlastVisiblePaginator = this.girdnumberOfPaginators;
        } else {
          this.girdlastVisiblePaginator = this.girdnumberOfPaginators;
          this.girdfirstVisiblePaginator = this.girdlastVisiblePaginator - (this.girdnumberOfPaginators % this.girdnumberOfVisiblePaginators);
        }
      }
//#endregion
     

//#region Items Data Grid Pagination
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
     //#endregion
}