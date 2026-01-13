import { computed, effect, Injectable, signal } from '@angular/core';
import {
  BasicTransformEvent,
  Canvas,
  FabricImage,
  FabricObject,
  FabricText,
  TPointerEvent,
} from 'fabric';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  public images = Array(55)
    .fill('')
    .map((_, index) => `cat_${index}.jpg`);
  private currentImageSrc = signal(
    this.images[Math.floor(Math.random() * this.images.length)]
  );
  public setCurrentImageSrc(src: string) {
    this.currentImageSrc.set(src);
  }
  public imageDimensions = signal({
    width: 0,
    height: 0,
    image: new Image(),
  });
  public currentImagePath = computed(() => `/cats/${this.currentImageSrc()}`);
  private canvasElement = signal<HTMLCanvasElement | undefined>(undefined);
  public setCanvas(canvasElement: HTMLCanvasElement) {
    this.canvasElement.set(canvasElement);
  }
  public addNewText() {
    this.fabricTexts.update((current) => [
      ...current,
      this.createFabricText('Writeth something...'),
    ]);
  }

  private createFabricText(text: string) {
    const fabricText = new FabricText(text, {
      fontSize: 40,
      fontFamily: 'IM Fell DW Pica',
      stroke: '#000000',
      strokeWidth: 8,
      fill: '#ffffff',
      textAlign: 'center',
      paintFirst: 'stroke',
      flipX: false,
      flipY: false,
      lockScalingFlip: true,
    });
    fabricText.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    });
    return fabricText;
  }

  public fabricTexts = signal([
    this.createFabricText("ENT'R THY TEXT..."),
    this.createFabricText('...TO MAKETH A DANK MEME!'),
  ]);

  public removeFabricText(textIn: FabricText) {
    this.fabricTexts.update((current) =>
      current.filter((text) => text !== textIn)
    );
  }

  public onDownload() {
    const canvas = this.canvas()!;
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement('a');
    link.download = `medieval-cat-meme-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }

  private canvas = signal<Canvas | undefined>(undefined);
  constructor() {
    const onResize = (obj: FabricObject<any>) => {
      if (!obj || !(obj instanceof FabricText)) return;

      const scale = Math.max(obj.scaleX!, obj.scaleY!);
      obj.set('fontSize', obj.fontSize! * scale);
      obj.scaleX = 1;
      obj.scaleY = 1;

      obj.setCoords();
      const boundingRect = obj.getBoundingRect();
      const canvas = this.canvas()!;
      const canvasWidth = canvas.width!;
      const canvasHeight = canvas.height!;

      if (
        boundingRect.width > canvasWidth ||
        boundingRect.height > canvasHeight
      ) {
        const scaleDownX = canvasWidth / boundingRect.width;
        const scaleDownY = canvasHeight / boundingRect.height;
        const scaleDown = Math.min(scaleDownX, scaleDownY);
        obj.set('fontSize', obj.fontSize! * scaleDown);
      }

      // Also check position constraints after resizing
      obj.setCoords();
      const newBoundingRect = obj.getBoundingRect();

      if (newBoundingRect.left < 0) {
        obj.left = obj.left - newBoundingRect.left;
      }
      if (newBoundingRect.top < 0) {
        obj.top = obj.top - newBoundingRect.top;
      }
      if (newBoundingRect.left + newBoundingRect.width > canvasWidth) {
        obj.left =
          canvasWidth - newBoundingRect.width + obj.left - newBoundingRect.left;
      }
      if (newBoundingRect.top + newBoundingRect.height > canvasHeight) {
        obj.top =
          canvasHeight - newBoundingRect.height + obj.top - newBoundingRect.top;
      }

      obj.setCoords();
    };

    const onMove = (obj: FabricObject) => {
      const canvas = this.canvas()!;
      const canvasWidth = canvas.width!;
      const canvasHeight = canvas.height!;

      obj.setCoords();
      const boundingRect = obj.getBoundingRect();

      if (
        boundingRect.left < 0 ||
        boundingRect.top < 0 ||
        boundingRect.left + boundingRect.width > canvasWidth ||
        boundingRect.top + boundingRect.height > canvasHeight
      ) {
        obj.left = Math.min(
          Math.max(boundingRect.width / 2, obj.left),
          canvasWidth - boundingRect.width / 2
        );
        obj.top = Math.min(
          Math.max(boundingRect.height / 2, obj.top),
          canvasHeight - boundingRect.height / 2
        );
        obj.setCoords();
      }
    };

    effect((onCleanup) => {
      const canvasElement = this.canvasElement();
      if (canvasElement) {
        const canvas = new Canvas(canvasElement, {
          width: 0,
          height: 0,
        });
        canvas.on('object:modified', () => canvas.renderAll());
        canvas.on('object:moving', (e) => onMove(e.target));
        canvas.on('object:scaling', (e) => onResize(e.target));
        canvas.on('object:added', (e) => onResize(e.target));
        canvas.on('object:modified', (e) => {
          onResize(e.target);
          onMove(e.target);
        });
        this.canvas.set(canvas);
        const onBodyClick = (e: MouseEvent) => {
          if (
            e.target !== canvas.upperCanvasEl &&
            e.target !== canvas.lowerCanvasEl
          ) {
            canvas.discardActiveObject();
            canvas.renderAll();
          }
        };
        document.body.addEventListener('mouseup', onBodyClick);
        onCleanup(() => {
          document.body.removeEventListener('mouseup', onBodyClick);
          canvas.dispose();
          this.canvas.set(undefined);
        });
      }
    });
    let init = false;
    effect((onCleanup) => {
      const canvas = this.canvas();
      const fabricTexts = this.fabricTexts();
      if (
        canvas &&
        this.imageDimensions().width &&
        this.imageDimensions().height &&
        this.currentImagePath()
      ) {
        canvas.setDimensions({
          width: this.imageDimensions().width,
          height: this.imageDimensions().height,
        });

        const bgImage = new FabricImage(this.imageDimensions().image, {
          selectable: false,
          moveCursor: 'initial',
          hoverCursor: 'initial',
        });
        canvas.add(bgImage);
        canvas.sendObjectToBack(bgImage);
        canvas.centerObject(bgImage);
        bgImage.scaleToWidth(this.imageDimensions().width);
        onCleanup(() => {
          console.log('clean up');
          bgImage.dispose();
          canvas.remove(bgImage);
        });

        let i = 0;
        for (const fabricText of fabricTexts) {
          if (!canvas.contains(fabricText)) {
            canvas.add(fabricText);
            canvas.centerObject(fabricText);
            if (!init) {
              if (i == 0) {
                fabricText.top = fabricText.height / 2;
              } else {
                fabricText.top = canvas.height - fabricText.height / 2;
              }
              canvas.fire('object:modified', { target: fabricText });
            }
          } else {
            canvas.fire('object:modified', { target: fabricText });
          }
          i++;
        }
        init = true;
        canvas.renderAll();
      }
    });
  }
}
