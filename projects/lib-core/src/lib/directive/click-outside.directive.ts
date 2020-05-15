import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';

// Usage: <div libClickOutside="doSomething()"></div>

@Directive({
  selector: '[libClickOutside]'
})
export class ClickOutsideDirective {

  @Output() clickOutsideEmitter = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef
  ) { }

  // The document prefix is to consider clicks anywhere in the whole page
  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  public onClickEvent(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    // If the click was not inside the element then an event is emitted
    if (!clickedInside) {
      this.clickOutsideEmitter.emit();
    }
  }

}
