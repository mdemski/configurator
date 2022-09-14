import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], serachText: string): any[] {
    if (!items) {
      return [];
    }
    if (!serachText) {
      return [];
    }
    serachText = serachText.toLocaleLowerCase();

    return items.filter(item => {
      let include = false;
      for (const property in item) {
        if (item[property].toLocaleLowerCase().includes(serachText)) {
          include = true;
        }
      }
      if (include) {
        return item;
      }
    });
  }

}
