import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appResizable]', // Attribute selector
})
export class ResizableDirective implements OnInit, AfterViewInit {
  @Input() resizableGrabWidth = 8;
  @Input() resizableMinWidth = 10;

  dragging = false;
  tableContainer: any;
  detailsContainer: any;
  dragBar: any;
  ghostBar: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    /*this.el.nativeElement.style['border-left'] =
      this.resizableGrabWidth + 'px solid darkgrey';*/
  }

  ngAfterViewInit(): void {
    this.tableContainer =
      this.el.nativeElement.querySelector('.table-container');
    this.detailsContainer =
      this.el.nativeElement.querySelector('.details-container');
    this.dragBar = this.el.nativeElement.querySelector(
      '.table-container #dragbar',
    );

    const mouseUp = (event: any) => {
      if (this.dragging) {
        const percentage = (event.pageX / window.innerWidth) * 100;
        const mainPercentage = 100 - percentage;
        this.tableContainer.style.width = percentage + '%';
        this.detailsContainer.style.width = mainPercentage + '%';
        this.renderer.removeChild(this.el.nativeElement, this.ghostBar);

        this.dragging = false;
      }
    };

    const mouseDown = (event: any) => {
      event.preventDefault();
      this.dragging = true;
      this.ghostBar = this.renderer.createElement('div');
      this.renderer.addClass(this.ghostBar, 'ghostbar');
      this.ghostBar.style.height = '100%';
      this.ghostBar.style.top = this.el.nativeElement.style.offsetTop;
      this.ghostBar.style.left = this.el.nativeElement.style.offsetLeft;
      this.ghostBar.style.position = 'absolute';
      this.ghostBar.style.width = '5px';
      this.ghostBar.style.backgroundColor = 'black';
      this.ghostBar.style.zIndex = 12000;
      this.ghostBar.style.opacity = '0.5';
      this.renderer.appendChild(this.el.nativeElement, this.ghostBar);

      document.addEventListener('mousemove', mouseMove, true);
    };

    const mouseMove = (event: any) => {
      this.ghostBar.style.left = event.pageX + 2 + 'px';
    };

    document.addEventListener('mouseup', mouseUp, true);
    this.dragBar.addEventListener('mousedown', mouseDown, true);
  }
}
