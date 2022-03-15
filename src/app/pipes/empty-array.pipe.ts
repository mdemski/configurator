import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emptyArrayPipe'
})
export class EmptyArrayPipe implements PipeTransform {
  transform(objects: any[]) {
    if (!objects) {
      return undefined;
    }
  }
}
