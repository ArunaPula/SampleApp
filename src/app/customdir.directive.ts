import { Directive, ElementRef, OnInit } from '@angular/core';
 @Directive({
 selector: '[customdir]'
 })
 export class CustomDirectives implements OnInit {
     constructor(private elementRef: ElementRef) {
     }
 ngOnInit() { 
    this.elementRef.nativeElement.innerHTML ='<h1>Hello World</h1>';
   }
 }