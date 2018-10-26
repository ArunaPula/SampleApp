export class Cities
{
    constructor(public StateID:number,public CityID: number,public CountryName:string, public CityName: string,public IsActive:boolean) { }
}
export interface ICity
{
    CityID:number;
    StateID:number;
    CityName:string;
    StateName:string;
    IsActive:boolean;
    IsDeleted:boolean;
}
export interface ICitiesColumnsOrder
{
    COrderId:number;
    COrderNo:number;
    ColumnName:string;
    IsChecked:boolean;
    IsActive:boolean;
    IsDeleted:boolean;
    CreatedBy:number;
    CreatedDate:string;
}
export interface IEmployeeList
{
   EmpID:number; 
   EmpName:string;
   EmpMobile:string;
   EmpAddress:string;
   DeptID:number; 
   IsActive:boolean;
   DeptName:string;
   IsDeleted:boolean;
}
export interface IEmployeesColOrder
{
    EOrderID:number;
    ColumnName:string;
    IndexNo:number;
    IsChecked:boolean;
    IsActive:boolean;
    IsDeleted:boolean;
    CreatedBy:number;
    CreatedDate:string;
}
export interface ILoginList
{
    LoginID:number;
    LoginName:string;
    FirstName:string;
    LastName:string;
    RoleID:number;
    MobileNo:string;
    IsActive:boolean;
    RoleType:string;
    //EmailID:string;
   // UPassword:string;
    ScreenNames:ScreenNames[];
}
export interface ScreenNames
{
    RoleScreenId:number;
    RoleID:number;
    ScreenName:string;
}
export class ALertMsg {
    public color: string;
    public Msg: string;
    public lblshow: boolean;
}

