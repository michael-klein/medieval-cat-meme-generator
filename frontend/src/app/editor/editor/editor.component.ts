import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { EditorService } from '../EditorService';
import { ContainerComponent } from '../../container/container.component';
import {
  BasicTransformEvent,
  Canvas,
  FabricImage,
  FabricObject,
  FabricText,
  TPointerEvent,
} from 'fabric';
import { EditorFormComponent } from '../editor-form/editor-form.component';

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
  constructor() {
    effect((onCleanup) => {
      const image = this.image().nativeElement;
      const observer = new ResizeObserver(() => {
        this.editorService.imageDimensions.set({
          width: image.clientWidth,
          height: image.clientHeight,
          image,
        });
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
