import { Directive, OnInit, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements OnInit {
  @Input('draggable') draggable: any;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    element.draggable = 'true';

    element.addEventListener('dragstart', (e) => {
      element.classList.add('drag');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', JSON.stringify(this.draggable));
    });

    element.addEventListener('dragend', (e) => {
      element.classList.remove('drag');
    });
  }
}
