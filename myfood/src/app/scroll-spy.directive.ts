import {
  Directive,
  Injectable,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[scrollSpy]',
})
export class ScrollSpyDirective {
  @Input() public spiedTags = [];
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string;

  constructor(private _el: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string;
    const children = this._el.nativeElement.children;
    const scrollTop = event.target.scrollTop;
    const parentOffset = event.target.offsetTop;
    console.log("from sky");
    console.log("children", children);
    console.log("scrollTop", scrollTop);
    console.log("parentOffset", parentOffset);

    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      console.log("offsetTop", element.offsetTop);
      console.log("cond", element.offsetTop - parentOffset <= scrollTop);

      if (this.spiedTags.some((spiedTag) => spiedTag === element.tagName)) {
        if (element.offsetTop - parentOffset <= scrollTop) {
          currentSection = element.id;
        }
      }
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
  }
}
