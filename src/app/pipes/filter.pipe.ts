import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, prop: string): any[] {

    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    return items.filter(singleItem =>
      singleItem[prop].toLowerCase().startsWith(searchText.toLowerCase())
    );

  }
}
