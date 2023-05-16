import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messagefilter'
})
export class MessagePipe implements PipeTransform {

  transform(items:any, searchText: string): any[] {
    
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase()

    return items.filter(it => {
    //  console.log(it)
      return it.text.toLocaleLowerCase().includes(searchText);
    });
    // return null;
  }

}
