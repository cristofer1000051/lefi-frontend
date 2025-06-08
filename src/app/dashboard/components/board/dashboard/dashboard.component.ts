import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../../menu/menu.component";
import { Point, CanvasTransform } from './board.utils';
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
  
  constructor() {
    this.sliderValue = 1;
  }
  ngAfterViewInit() {
    this.observeCanvasResize();
    
  }

  startDraw(event: MouseEvent) {
    this.isDrawing = true;
    this.lastX = (event.offsetX - this.offsetX) / this.scale;
    this.lastY = (event.offsetY - this.offsetY) / this.scale;

  }
  observeCanvasResize() {
    const canvas = this.canvasRef.nativeElement;
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas(); // chiamata ogni volta che cambia la dimensione del canvas
    });
  
    this.resizeObserver.observe(canvas);
  }
  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
  
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
  
    canvas.width = cssWidth;
    canvas.height = cssHeight;
  
    this.boundingRect = canvas.getBoundingClientRect();
  
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = this.sliderValue;
    this.ctx.lineCap = 'round';
  
    // eventualmente chiami un redraw o reinit
    this.redraw();
  }
  draw(event: MouseEvent) {
    const x = (event.offsetX - this.offsetX) / this.scale;
    const y = (event.offsetY - this.offsetY) / this.scale;

    this.ctx.save();
    this.ctx.resetTransform();
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.restore();

    this.lastX = x;
    this.lastY = y;
  }

  endDraw() {
    this.isDrawing = false;
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
    console.log("zoom");
    event.preventDefault();
    const zoom = event.deltaY > 0 ? 0.9 : 1.1;
    this.scale *= zoom;
    this.redraw();
  }

  redraw() {
    console.log("REDRAW");
    const canvas = this.canvasRef.nativeElement;
    const imgData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
    this.ctx.putImageData(imgData, 0, 0);
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
      this.startPan(event);
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
}
