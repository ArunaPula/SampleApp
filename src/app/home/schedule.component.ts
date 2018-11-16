import { Component,OnInit } from '@angular/core';
import { NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
@Component({
    selector: 'schedule-component',
    templateUrl: './schedule.component.html'
   
})

export class ScheduleComponent implements OnInit {
    public Time:string="";
    public Daily:boolean=true;
    public Weekly:boolean=false;
    public Monthly:boolean=false;
    public RNoEndDate:boolean=true;
    public REndAfterDate:boolean=false;
    public RLatestEndDate:boolean=false;
    public StartDate:NgbDate;
    public LatestEndDate: Date = new Date(2018, 11, 14);
    constructor(private calendar: NgbCalendar)
    {
        this.StartDate=this.calendar.getToday();
    }
    public value: Date = new Date(2018, 11, 14);
    ngOnInit(){
        this.Weekly=false;
        this.Monthly=false;
         this.Daily=true;
    }
    public setradio(values:string){
        if(values=='Daily')
        { 
            this.Weekly=false;
            this.Monthly=false;
             this.Daily=true;
        }       
        else if(values=='Weekly'){
            this.Monthly=false;
            this.Daily=false;
             this.Weekly=true;
        }
        else if(values=='Monthly'){
            this.Daily=false;
            this.Weekly=false;
             this.Monthly=true;
        }
        else{
            this.Weekly=false;
            this.Monthly=false;
             this.Daily=true;
        }
        
    }
}
