import React from 'react';
import { hexToRgb } from '../utils/colorUtils';

interface WaveCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  backgroundColor: string;
}

const WaveCanvas: React.FC<WaveCanvasProps> = ({ canvasRef, backgroundColor }) => {
  const bgRgb = hexToRgb(backgroundColor);
  
  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`
    }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default WaveCanvas;