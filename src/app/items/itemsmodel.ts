export class Items{
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
    Discount:number;
    Status:string;
}
export class CategoryList{    
    CategoryID:number;
    CategoryCode:string;
    CategoryName:string;
}