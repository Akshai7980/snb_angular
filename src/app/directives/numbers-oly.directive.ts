import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumbersOly]'
})
export class NumbersOlyDirective {

  constructor(private control: NgControl) {}

  processInput(value: any) {
    return value.replace(/[a-zA-Z\s\!\@\#\$\%\^\&\*\)\(+\=\._-]/g, '');
  }

  @HostListener('ngModelChange', ['$event'])
  ngModelChange(value: any) {
    this.control.valueAccessor?.writeValue(this.processInput(value));
  }

}
