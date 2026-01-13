import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ContainerComponent } from '../../container/container.component';
import { EditorFormComponent } from '../editor-form/editor-form.component';
import { EditorService } from '../EditorService';

@Component({
  selector: 'app-editor',
  imports: [ContainerComponent, EditorFormComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {
  protected canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  protected image = viewChild.required<ElementRef<HTMLImageElement>>('image');
  protected editorService = inject(EditorService);
  protected imageLoaded = signal(false);
  protected showLoader = signal(false);
  protected setImageLoaded() {
    this.imageLoaded.set(true);
  }
  constructor() {
    effect((onCleanup) => {
      if (!this.imageLoaded()) {
        const id = setTimeout(() => this.showLoader.set(true), 500);
        onCleanup(() => {
          clearTimeout(id);
          this.showLoader.set(false);
        });
      }
    });
    effect((onCleanup) => {
      if (!this.imageLoaded()) {
        return;
      }
      const image = this.image().nativeElement;
      const updateDimensions = () => {
        this.editorService.imageDimensions.set({
          width: image.clientWidth,
          height: image.clientHeight,
          image,
        });
      };

      const observer = new ResizeObserver(() => {
        updateDimensions();
      });
      observer.observe(image);
      onCleanup(() => {
        observer.disconnect();
      });
    });
    effect(() => {
      this.editorService.setCanvas(this.canvas()?.nativeElement);
    });
  }
}
