import { Pipe, PipeTransform } from '@angular/core';
import { Category } from './categoriesmodel';
@Pipe({ name: 'basecustompipe' })
export class CategoryPipe implements PipeTransform {
  
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