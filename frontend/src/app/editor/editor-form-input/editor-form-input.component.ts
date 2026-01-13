import { Component, effect, inject, input, signal } from '@angular/core';
import { FabricText } from 'fabric';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EditorService } from '../EditorService';

@Component({
  selector: 'app-editor-form-input',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './editor-form-input.component.html',
  styleUrl: './editor-form-input.component.scss',
})
export class EditorFormInputComponent {
  private http = inject(HttpClient);
  protected tooltipId = `translate-tooltip-${crypto.randomUUID()}`;
  protected formElementId = `input-${crypto.randomUUID()}`;
  public fabricText = input.required<FabricText>();
  protected formControl = signal('');
  private editorService = inject(EditorService);
  constructor() {
    effect(() => {
      this.formControl.set(this.fabricText().text);
    });
    effect(() => {
      const fabricText = this.fabricText();
      fabricText.set('text', this.formControl());
      if (fabricText.canvas) {
        fabricText.setCoords();
        fabricText.canvas.fire('object:modified', { target: fabricText });
        fabricText.canvas.renderAll();
      }
    });
  }
  protected translationRunning = signal(false);
  protected onTranslateClick() {
    const text = this.formControl();
    if (!text || this.translationRunning()) return;
    this.translationRunning.set(true);
    this.http
      .get<{ translated: string }>(
        `${environment.apiUrl}/translate?text=${encodeURIComponent(text)}`
      )
      .subscribe({
        next: (response) => {
          this.formControl.set(response.translated);
          this.translationRunning.set(false);
        },
        error: (error) => {
          console.error('Translation failed:', error);
          this.translationRunning.set(false);
        },
      });
  }
  protected onRemoveClick() {
    this.editorService.removeFabricText(this.fabricText());
  }
}
