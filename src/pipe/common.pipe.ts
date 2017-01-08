import { Pipe, PipeTransform } from '@angular/core';
/*
 * 문자 시작, 끝 자리수 만큼 substring  
 * 
 * Usage:
 *   value | avatarSub:start:end
 * Example:
 *   {{ (삼성동) |  exponentialStrength:1:2}}
 *   formats to: 1024
*/
@Pipe({ name: 'subString' })
export class SubStringPipe implements PipeTransform {
  transform(value: string, start: number, end: number): string {
    let regExp = /\(|\)|\s|"|,/g
    if (value != '') {
      return value.replace(regExp, '').substring(start, end);
    }else{
      return '읍'
    }
  }
}

@Pipe({ name: 'orderBy'})
export class OrderByPipe implements PipeTransform{
  transform(arr: Array<any>, key: any): any{
    arr.sort((a: any, b: any) => {
      if (a.index < b.index) {
        return 1;
      } else if (a.index > b.index) {
        return -1;
      } else {
        return 0;
      }
    });
    return arr;
  }
}