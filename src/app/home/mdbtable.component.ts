
import { Component, OnInit, ViewChildren, QueryList, ElementRef,HostListener } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
@Component({
    selector: 'mdbtable-app',
    templateUrl: './mdbtable.component.html'
})
export class TableComponent implements OnInit {
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

  constructor(private el: ElementRef) {}

  tableData = [
    { id: 1, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
    { id: 2, firstName: 'John', lastName: 'Doe', username: '@john' },
    { id: 3, firstName: 'Lessie', lastName: 'Moe', username: '@lessie' },
    { id: 4, firstName: 'Otton', lastName: 'Otto', username: '@otton' },
    { id: 5, firstName: 'Krauze', lastName: 'John', username: '@krauze' },
    { id: 6, firstName: 'Lex', lastName: 'Lucky', username: '@lex' },
    { id: 7, firstName: 'Allie', lastName: 'Bill', username: '@allie' },
    { id: 8, firstName: 'Anna', lastName: 'Frost', username: '@anna' },
    { id: 9, firstName: 'Bob', lastName: 'One', username: '@bob' },
    { id: 10, firstName: 'Carl', lastName: 'Johnson', username: '@cj' },
    { id: 11, firstName: 'Mia', lastName: 'Marx', username: '@mia' },
    { id: 12, firstName: 'Cia', lastName: 'Fbi', username: '@cia' },
    { id: 13, firstName: 'John', lastName: 'Doe', username: '@johny' },
    { id: 14, firstName: 'Mark', lastName: 'Otto', username: '@mdo' },
    { id: 15, firstName: 'Lessie', lastName: 'Moe', username: '@lessie'}
  ];
 
 
  displayedColumns = ['id', 'firstName', 'lastName', 'username'];
  dataSource = new MatTableDataSource(this.tableData);
  sortBy(by: string | any): void {

    this.tableData.sort((a: any, b: any) => {
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

  ngOnInit() {
    if (this.tableData.length % this.itemsPerPage === 0) {
      this.numberOfPaginators = Math.floor(this.tableData.length / this.itemsPerPage);
    } else {
      this.numberOfPaginators = Math.floor(this.tableData.length / this.itemsPerPage + 1);
    }

    for (let i = 1; i <= this.numberOfPaginators; i++) {
      this.paginators.push(i);
    }
  }
  @HostListener('dragstart', ['$event'])
  dragStart(event) 
  {
    event.dataTransfer.setData("Text", event.target.id);
    
}
@HostListener('drag', ['$event'])
dragging(event) 
{
    //document.getElementById("demo").innerHTML = "The p element is being dragged";
}
@HostListener('dragover', ['$event'])
allowDrop(event) 
{
    event.preventDefault();
}
@HostListener('drop', ['$event'])
drop(event) 
{   
   let pos3 = event.clientX;
   let pos4 = event.clientY;
   let pos1 = pos3 - event.clientX;
   let pos2 = pos4 - event.clientY;
    event.preventDefault();
   
}

}