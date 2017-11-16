import { Directive, OnInit, Output, ElementRef, EventEmitter } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[droppable]'
})
export class DroppableDirective implements OnInit {
  @Output() dropped = new EventEmitter();

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
    const element = this.elementRef.nativeElement;

    element.addEventListener('dragover', (e) => {
      if (e.preventDefault) e.preventDefault();
      element.classList.add('over');
      e.dataTransfer.dropEffect = 'move';
    });

    element.addEventListener('dragenter', (e) => {
      element.classList.add('over');
    });

    element.addEventListener('dragleave', (e) => {
      element.classList.remove('over');
    });

    element.addEventListener('drop', (e) => {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      element.classList.remove('over');
      const data = JSON.parse(e.dataTransfer.getData('text'));
      this.dropped.emit(data);
    });
  }
}
