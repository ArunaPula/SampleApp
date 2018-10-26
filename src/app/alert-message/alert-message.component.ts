import { Component, OnInit,Input } from '@angular/core';
import {ALertMsg} from '../model';
@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit{
  @Input() data: ALertMsg;
  constructor() { }
  lblshow:boolean;
  ServiceStatus:string;
  color:string;
  ngOnInit() {  
    this.lblshow=this.data.lblshow;
    this.color=this.data.color;
    this.ServiceStatus=this.data.Msg;
  }

}
