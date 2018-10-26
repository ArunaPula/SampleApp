import {  Directive, ElementRef, HostListener, Input, OnInit  } from '@angular/core';

@Directive({
  selector: '[appNotificationAlert]'
})
export class NotificationAlertDirective implements OnInit{

  @Input('appNotificationAlert') highlightColor: string;

  constructor(private el: ElementRef) {  
   }
ngOnInit()
{
  this.highlight(this.highlightColor || 'red');
}
  // @HostListener('mouseenter') onMouseEnter() {
  //   this.highlight(this.highlightColor || 'red');
  // }

  // @HostListener('mouseleave') onMouseLeave() {
  //   this.highlight(null);
  // }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
   
  }

}
