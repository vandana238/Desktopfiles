import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getfirstletter'
})
export class DateagoPipe implements PipeTransform {

  transform(value: string, args: any[]): string {
    if (!value) { return ''; }
    else{
      var firstWords='' ;
      var values=value.split(" ")
      for (let i = 0; i < values.length; i++)
      {      
        // console.log(values[i])
        if(values[i].length>0 && firstWords.length<2)
        firstWords+=values[i][0].toUpperCase()
      }
      return firstWords;
    }
}

}
