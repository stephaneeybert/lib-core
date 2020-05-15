import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';

// Usage: <div libCoreClickOutside (clickOutsideEvent)="doSomething()"></div>

@Directive({
  selector: '[libCoreClickOutside]'
})
export class ClickOutsideDirective {

  @Output()
  clickOutsideEvent: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(
    private elementRef: ElementRef
  ) { }

  // The document prefix is to consider clicks anywhere in the whole page
  @HostListener('document:touchstart', ['$event', '$event.target'])
  @HostListener('document:click', ['$event', '$event.target'])
  public onClickEvent(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
    // If the click was not inside the element then an event is emitted
      this.clickOutsideEvent.emit(event);
    }
  }

}
