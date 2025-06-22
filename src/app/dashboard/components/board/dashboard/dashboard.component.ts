import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../../menu/menu.component";
import { MatSliderModule } from '@angular/material/slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';
import { Draw } from './class/Draw';
import { PolyLine } from './utils/PolyLine';
import { FormattedDate } from './utils/FormattedDate';
import { PolyLinesService } from './services/polylines.service';
import { Coord } from './utils/Coord';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MenuComponent, MatSliderModule, FontAwesomeModule,
    ColorPickerDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  @ViewChild('svgRef') svgRef!: ElementRef<SVGElement>;

  private draw!: Draw;

  public sliderValue: number = 2;
  public currentColor: string = 'black';

  private polyLine!: PolyLine;
  private isDrawing: boolean = false;
  private polyLineService: PolyLinesService;

  constructor() {
    this.draw = new Draw();

    this.polyLineService = new PolyLinesService();
  }

  ngAfterViewInit() { }


  onMouseDown($event: MouseEvent) {
    if ($event.button == 0) {
      this.isDrawing = true;
      this.polyLine = new PolyLine();
      this.polyLineService.createPolyLine(this.getEventCoord($event), this.polyLine, this.currentColor, this.svgRef, this.sliderValue);
    }
  }


  onMouseMove($event: MouseEvent) {
    if (this.isDrawing) {
      const currentPoint = this.polyLineService.getMouseCoord(this.getEventCoord($event), this.svgRef);;
      //Prendiamo i punti dal polyline salvato nel oggetto polyLine
      let points = this.polyLine.polyLineElement.getAttribute('points');
      const newPoint = `${currentPoint.x},${currentPoint.y}`;
      //Inseriamo uno spazio, poiche points, riceve una string di dati separati con spazi
      if (points !== null && points.length > 0) {
        points += ` ${newPoint}`;
      } else {
        points = `${newPoint}`;
      }
      this.polyLine.polyLineElement.setAttribute('points', points);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp($event: MouseEvent) {
    if (this.polyLine !== null) {
      this.isDrawing = false;
      this.draw.allPolylines.push(this.polyLine);
      console.log("Mouse up");
      console.log(this.draw);
    }
  }

  zoom($event: WheelEvent) {
    console.log("Mouse zoom");
  }


  clearCanvas() {
    if (this.draw.allPolylines.length > 0) {
      this.draw.allPolylines.forEach(poly => {
        let polyElement = document.getElementById(poly.id);
        if (polyElement) {
          polyElement.remove();
          this.draw.allPolylines=[];
        }
      });
      console.log("Cancellare canvas");
    }
  }

  getEventCoord($event: MouseEvent) {
    const coord: Coord = {
      x: $event.clientX,
      y: $event.clientY
    };
    return coord;
  }

}
