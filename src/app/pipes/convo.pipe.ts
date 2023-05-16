import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convofilter'
})
export class ConvoPipe implements PipeTransform {

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
    //  console.log(it)
      return it.user.name.toLocaleLowerCase().includes(searchText);
    });
    // return null;
  }

}
