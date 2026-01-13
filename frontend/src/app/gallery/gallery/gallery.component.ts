import { Component, inject } from '@angular/core';
import { GalleryItemComponent } from '../gallery-item/gallery-item.component';
import { ContainerComponent } from '../../container/container.component';
import { EditorService } from '../../editor/EditorService';

@Component({
  selector: 'app-gallery',
  imports: [GalleryItemComponent, ContainerComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  protected editorService = inject(EditorService);
}
