// Interfaccia per le trasformazioni del canvas
export interface CanvasTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface Point {
  x: number;
  y: number;
}
export interface DrawingPath {
  color: string;
  width: number;
  points: Point[];
}
