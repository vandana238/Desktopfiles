import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'email',
})
export class EmailPipe implements PipeTransform {

  transform(items:any, searchText: string): any[] {
    // console.log(items,searchText)
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase()

    return items.filter(it => {
     
      return JSON.stringify(it).toLocaleLowerCase().includes(searchText);
    });
    // return null;
  }

}