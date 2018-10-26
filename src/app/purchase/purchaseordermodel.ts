import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export class PurchaseOrderModel//:PurchaseOrder
{
    public  PurchaseOrderID:number;
    public  OrderNo:string;
    public  OrderDate1:NgbDate;
    public  OrderDate:string;
    public  CityID:number;
    public VendorID:number;
    public Status:string;
    public TotalAmount:number;
    public TotalCGST:number;
    public TotalSGST:number;
    public TotalIGST:number;
    public TotalDiscount:number;
    public TotalQunatity:number;
    public PODetails:PODetails[];
    public POAttachments:POAttachments[];
}
export class PODetails
{
    public PODetailID:number;
    public PurchaseOrderID:number;
    public ItemID:number;
    public ItemName:string;
    public ItemCode:string;
    public ItemPrice:number;
    public CategoryName:string;
    public CGST:number;
    public SGST:number;
    public IGST:number;
    public Quantity:number;
    public Discount:number;
    public IsChecked:boolean;
   // public DiscountPrice:number;
    public NetAmount:number;
    public IsActive:boolean;
    public IsDeleted:boolean;
}
export class Items1{
    ItemID:number;
    ItemCode:string;
    ItemName:string;
    CategoryID:number;    
    CategoryName:string;
    ItemPrice:number;
    CGST:number;
    SGST:number;
    IGST:number;
    TotalGST:number;
    MinQuantity:number;
    MaxQuantity:number;
    Quantity:number;
    Discount:number;
    Status:string;
    IsChecked:boolean;
    NetAmount:number;
}
export class VendorList{    
    VendorID:number;
    VendorCode:string;
    VendorName:string;
}
export class POAttachments{    
    PODocumentId:number;
    PurchaseOrderID:number;
    FileName:string;
    FilePath:string;
    File:FileList;
}