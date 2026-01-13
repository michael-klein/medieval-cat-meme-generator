import { Component, computed, inject, input } from '@angular/core';
import { EditorService } from '../../editor/EditorService';

@Component({
  selector: 'app-gallery-item',
  imports: [],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.scss',
})
export class GalleryItemComponent {
  imgSrc = input.required<string>();
  protected imagePath = computed(() => `/cats/thumbs/${this.imgSrc()}`);
  protected editorService = inject(EditorService);
}
