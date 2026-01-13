import { Component } from '@angular/core';
import { ContainerComponent } from '../container/container.component';
import { GalleryComponent } from '../gallery/gallery/gallery.component';

@Component({
  selector: 'app-header',
  imports: [ContainerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
