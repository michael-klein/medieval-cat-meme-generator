import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { GalleryComponent } from './gallery/gallery/gallery.component';
import { EditorComponent } from './editor/editor/editor.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, GalleryComponent, EditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
