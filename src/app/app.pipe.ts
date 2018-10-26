import { Pipe, PipeTransform } from '@angular/core';
import { ICity } from './model';
@Pipe({ name: 'city' })
export class CityPipe implements PipeTransform {
  // transform(gridData: any, searchText: any): any {
  //   if(searchText == null || searchText =="" || searchText ==undefined) return gridData;

  //   return gridData.filter(function(city){
  //     return city.CityName.toLowerCase().indexOf(searchText.toLowerCase()) > -1 
  //     || city.StateName.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
     
  //   })
  // }
  transform(gridData: any, filter: any, isAnd: boolean): any {
    if (filter && Array.isArray(gridData)) {
      let filterKeys = Object.keys(filter);
      if (isAnd) {
        return gridData.filter(item =>
            filterKeys.reduce((memo, keyName) =>
                (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
      } else {
        return gridData.filter(item => {
          return filterKeys.some((keyName) => {
            //console.log(keyName);
            return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] === "";
          });
        });
      }
    } else {
      return gridData;
    }
  }
}