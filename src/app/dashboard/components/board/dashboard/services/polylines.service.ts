import { ElementRef } from "@angular/core";
import { Coord } from "../utils/Coord";
import { PolyLine } from "../utils/PolyLine";
import { FormattedDate } from "../utils/FormattedDate";

export class PolyLinesService {
  private formattedDate!: FormattedDate;
  constructor() {
    
  }

  public getMouseCoord(coord: Coord, svgRef: ElementRef<SVGElement>): { x: number, y: number } {
    // Cast the native SVG element to SVGSVGElement to access getScreenCTM()
    const svgElement = svgRef.nativeElement as SVGSVGElement;
    const CTM = svgElement.getScreenCTM();
    if (!CTM) {
      console.error('SVG CTM not available');
      return { x: 0, y: 0 };
    }
    const x = (coord.x - CTM.e) / CTM.a;
    const y = (coord.y - CTM.f) / CTM.d;
    return { x, y };
  }

  createPolyLine
    (
      coord: Coord,
      polyLine: PolyLine,
      currentColor: String,
      svgRef: ElementRef<SVGElement>,
      sliderValue: Number
    ) {
    this.formattedDate = new FormattedDate();
    let currentPolyline = document.createElementNS('http://www.w3.org/2000/svg', `polyline`);
    currentPolyline.setAttribute('stroke', currentColor.toString());
    currentPolyline.setAttribute('stroke-width', sliderValue.toString());
    currentPolyline.setAttribute('fill', 'none');
    currentPolyline.setAttribute('id', this.formattedDate.getId());

    const initialPoint = this.getMouseCoord(coord, svgRef);
    currentPolyline.setAttribute('points', `${initialPoint.x},${initialPoint.y}`);

    polyLine.id = this.formattedDate.getId();

    polyLine.polyLineElement = currentPolyline;
    svgRef.nativeElement.appendChild(currentPolyline);
  }
}