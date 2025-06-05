import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Point } from './board.utils';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from "../../menu/menu.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, MenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('whiteboardCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  isDrawing: boolean = false;
  lastPoint: Point | null = null;

  currentColor: string = '#000000';
  currentLineWidth: number = 2;

  private paddingLeft: number = 0;
  private paddingTop: number = 0;
  ngAfterViewInit(): void {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        this.ctx = context;
        this.setupCanvas();
      } else {
        console.error("Impossibile ottenere il contesto 2D del canvas");
      }
    }
  }
  // Metodo per gestire il ridimensionamento della finestra
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.canvasRef && this.ctx) {
      this.setCanvasDimensions();
      this.setupCanvas();
      this.clearCanvas(); // Pulisci il canvas al ridimensionamento per evitare distorsioni
    }
  }
  private setCanvasDimensions(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const computedStyle = getComputedStyle(canvas);
    this.paddingLeft = parseFloat(computedStyle.paddingLeft);
    this.paddingTop = parseFloat(computedStyle.paddingTop);
    console.log(`Canvas dimensions updated: ${canvas.width}x${canvas.height}, Padding: ${this.paddingLeft},${this.paddingTop}`); // Debugging
  }
  private setupCanvas(): void {
    // Imposta le dimensioni del canvas.
    // È importante impostare width e height direttamente sull'elemento canvas
    // per evitare distorsioni del disegno.
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const computedStyle = getComputedStyle(canvas);
    this.paddingLeft = parseFloat(computedStyle.paddingLeft);
    this.paddingTop = parseFloat(computedStyle.paddingTop);
    // Impostazioni iniziali del contesto di disegno
    this.ctx.lineWidth = this.currentLineWidth;
    this.ctx.lineCap = 'round'; // Rende le estremità delle linee arrotondate
    this.ctx.lineJoin = 'round'; // Rende gli angoli delle linee arrotondati
    this.updateStrokeStyle(); // Applica il colore e lo spessore iniziali
  }
  /**
     * Aggiorna lo stile del tratto (colore e spessore) del contesto di disegno.
     * Chiamato quando cambiano i valori degli input.
     */
  updateStrokeStyle(): void {
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentLineWidth;
  }
  /**
     * Calcola le coordinate del mouse relative all'elemento canvas.
     * @param event L'evento del mouse.
     * @returns Un oggetto Point con le coordinate x e y.
     */
  private getMousePos(event: MouseEvent): Point {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  /**
 * Inizia il processo di disegno quando il mouse viene premuto.
 * @param event L'evento mousedown.
 */
  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    this.lastPoint = this.getMousePos(event);
    this.ctx.beginPath(); // Inizia un nuovo percorso di disegno
    this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y); // Sposta il "pennello" al punto iniziale

  }

  /**
    * Disegna una linea mentre il mouse viene trascinato, se isDrawing è true.
    * @param event L'evento mousemove.
    */
  draw(event: MouseEvent): void {
    if (!this.isDrawing) return;
    console.log('Disegnando:', event.offsetX, event.offsetY);
    const currentPoint = this.getMousePos(event);
    if (this.lastPoint) {
      this.ctx.lineTo(currentPoint.x, currentPoint.y); // Disegna una linea dal punto precedente al corrente
      this.ctx.stroke(); // Applica la linea al canvas

      // Aggiorna il punto precedente per il prossimo segmento
      this.lastPoint = currentPoint;
    }
  }

  /**
   * Ferma il processo di disegno quando il mouse viene rilasciato o esce dal canvas.
   */
  stopDrawing(): void {
    this.isDrawing = false;
    this.lastPoint = null;
    this.ctx.closePath(); // Chiude il percorso corrente
  }

  /**
   * Cancella l'intero contenuto del canvas.
   */
  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }
}
