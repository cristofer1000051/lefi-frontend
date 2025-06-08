import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../../menu/menu.component";
import { Point, CanvasTransform, DrawingPath } from './board.utils';
import { MatSliderModule } from '@angular/material/slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MenuComponent, MatSliderModule, FontAwesomeModule,
    ColorPickerDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  sliderValue: number;
  currentColor: any;
  private isDrawing = false;
  private isPanning = false;
  private lastX = 0;
  private lastY = 0;
  private offsetX = 0;
  private offsetY = 0;
  private scale = 1;
  private resizeObserver!: ResizeObserver;
  boundingRect!: DOMRect;
  private bufferCanvas!: HTMLCanvasElement;
  private bufferCtx!: CanvasRenderingContext2D;
  private currentPath: DrawingPath | null = null; 
  private paths: DrawingPath[] = [];
  constructor() {
    this.sliderValue = 1;
  }
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    // Initialize the off-screen buffer canvas
    this.bufferCanvas = document.createElement('canvas');
    // Set buffer dimensions to match the visible canvas's current client dimensions
    this.bufferCanvas.width = canvas.clientWidth;
    this.bufferCanvas.height = canvas.clientHeight;
    this.bufferCtx = this.bufferCanvas.getContext('2d', { willReadFrequently: true })!;

    // Apply initial drawing context properties to the visible canvas
    this.ctx.lineWidth = this.sliderValue;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.currentColor;

    // Set up the ResizeObserver to dynamically adjust canvas size on window/element resize
    this.observeCanvasResize();
    this.resizeCanvas(); 
    
  }

  startDraw(event: MouseEvent) {
    this.isDrawing = true;
    // Calculate the initial point's coordinates in the "world" space,
    // accounting for current pan (offsetX, offsetY) and zoom (scale).
    const x = (event.offsetX - this.offsetX) / this.scale;
    const y = (event.offsetY - this.offsetY) / this.scale;

    // Create a new DrawingPath object for the current stroke
    this.currentPath = {
      color: this.currentColor,
      width: this.sliderValue,
      points: [{ x, y }] // Add the first point
    };
    // Add this new path to the collection of all paths
    this.paths.push(this.currentPath);

    this.redraw(); // Redraw the canvas to show the immediate start of the stroke
  }

  observeCanvasResize() {
    const canvas = this.canvasRef.nativeElement;
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas(); // Trigger canvas dimension update and redraw
    });
    this.resizeObserver.observe(canvas);
  }
  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;

    // Get the current CSS computed dimensions of the canvas
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;

    // Update the canvas element's internal `width` and `height` attributes
    // to match its CSS dimensions. This prevents blurry drawings.
    canvas.width = cssWidth;
    canvas.height = cssHeight;

    // Also update the buffer canvas dimensions to match
    this.bufferCanvas.width = cssWidth;
    this.bufferCanvas.height = cssHeight;

    // Update the bounding rectangle for accurate mouse event coordinate calculations
    this.boundingRect = canvas.getBoundingClientRect();

    // Re-apply common context settings to the visible canvas after resize
    this.ctx.lineWidth = this.sliderValue;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.currentColor;

    // Trigger a redraw to render all existing content with the new dimensions
    this.redraw();
  }
  draw(event: MouseEvent) {
    // Only proceed if drawing is active and there's a current path
    if (!this.isDrawing || !this.currentPath) return;

    // Calculate the current point's coordinates in "world" space
    const x = (event.offsetX - this.offsetX) / this.scale;
    const y = (event.offsetY - this.offsetY) / this.scale;

    // Add the new point to the current path's points array
    this.currentPath.points.push({ x, y });

    this.redraw(); // Redraw the entire canvas to reflect the updated path
  }

  endDraw() {
    this.isDrawing = false;
    this.currentPath = null; 
  }

  startPan(event: MouseEvent) {
    if (event.button !== 1) return; // middle mouse
    this.isPanning = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  pan(event: MouseEvent) {
    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;
    this.offsetX += dx;
    this.offsetY += dy;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.redraw();
  }

  endPan() {
    this.isPanning = false;
  }

  zoom(event: WheelEvent) {
    event.preventDefault(); // Prevent default page scrolling

    // Determine zoom direction: 0.9 for zoom out, 1.1 for zoom in
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;

    // Get mouse position relative to the canvas element
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // Calculate the "world" coordinates (coordinates in the drawing space)
    // of the mouse cursor *before* applying the new zoom.
    const worldX = (mouseX - this.offsetX) / this.scale;
    const worldY = (mouseY - this.offsetY) / this.scale;

    // Apply the new zoom scale
    this.scale *= zoomFactor;

    // Recalculate the offset to keep the "world" point under the mouse cursor fixed.
    // This creates the effect of zooming into or out of the mouse's position.
    this.offsetX = mouseX - worldX * this.scale;
    this.offsetY = mouseY - worldY * this.scale;

    this.redraw();
  }

  redraw() {
    const canvas = this.canvasRef.nativeElement;

    // 1) Clear the visible canvas context completely, resetting its transform first.
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to identity matrix
    this.ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire visible canvas

    // 2) Clear the buffer canvas context completely.
    this.bufferCtx.clearRect(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);

    // 3) Redraw all stored paths onto the buffer canvas.
    //    Drawing on the buffer happens at the original (1:1) scale,
    //    without applying pan/zoom transforms here.
    this.paths.forEach(path => {
      this.bufferCtx.beginPath();
      // Move to the first point of the path
      if (path.points.length > 0) {
        this.bufferCtx.moveTo(path.points[0].x, path.points[0].y);
      }
      // Draw lines to subsequent points
      for (let i = 1; i < path.points.length; i++) {
        this.bufferCtx.lineTo(path.points[i].x, path.points[i].y);
      }
      this.bufferCtx.strokeStyle = path.color; // Set stroke color for this path
      this.bufferCtx.lineWidth = path.width;   // Set line width for this path
      this.bufferCtx.lineCap = 'round';        // Ensure round line caps
      this.bufferCtx.stroke();                 // Render the path
    });

    // 4) Apply the current zoom (scale) and pan (offsetX, offsetY) transforms
    //    to the visible canvas context.
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);

    // 5) Draw the entire content of the buffer canvas onto the visible canvas.
    //    Because the visible canvas's context has the transforms applied,
    //    the buffered drawing will appear scaled and panned.
    this.ctx.drawImage(this.bufferCanvas, 0, 0);
  }

  onMouseDown(event: MouseEvent) {
    console.log("click down");
    if (event.button === 0) {
      this.startDraw(event);
    } else if (event.button === 1) {
      this.startPan(event);
    }
  }
  onMouseMove(event: MouseEvent) {

    if (this.isDrawing) {
      this.draw(event);
      console.log("drawing");
    } else if (this.isPanning) {
      console.log("rotellina");
      this.pan(event);
    }
  }
  onMouseUp(event: MouseEvent) {
    console.log("click up");
    if (event.button == 0) {
      this.endDraw();
    } else if (event.button === 1) {
      this.endPan();
    }
  }
  onColorChange(color: string) {
    this.currentColor = color;
    // New strokes will use this color. No immediate redraw needed for existing strokes.
  }
  clearCanvas() {
    this.paths = []; // Empty the array of stored paths
    this.offsetX = 0; // Reset horizontal pan
    this.offsetY = 0; // Reset vertical pan
    this.scale = 1; // Reset zoom scale
    this.redraw(); // Redraw the now-empty canvas
  }
}
