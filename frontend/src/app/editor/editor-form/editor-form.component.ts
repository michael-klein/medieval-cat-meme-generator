import { Component, inject } from '@angular/core';
import { EditorService } from '../EditorService';
import { EditorFormInputComponent } from '../editor-form-input/editor-form-input.component';

@Component({
  selector: 'app-editor-form',
  imports: [EditorFormInputComponent],
  templateUrl: './editor-form.component.html',
  styleUrl: './editor-form.component.scss',
})
export class EditorFormComponent {
  protected editorService = inject(EditorService);
  constructor() {}
}
