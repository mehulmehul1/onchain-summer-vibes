import { useRef, useCallback } from 'react';
import { createSVGMask } from '../utils/canvasUtils';

export const useSVGMask = () => {
  const fillMaskRef = useRef<ImageData | null>(null);
  const fillMaskPromiseRef = useRef<Promise<ImageData> | null>(null);
  const strokeMaskRef = useRef<ImageData | null>(null);
  const strokeMaskPromiseRef = useRef<Promise<ImageData> | null>(null);

  const createMask = useCallback((width: number, height: number, strokeEnabled: boolean = false, strokeWidth: number = 0) => {
    fillMaskPromiseRef.current = createSVGMask(width, height, 'fill');
    fillMaskRef.current = null;
    
    if (strokeEnabled && strokeWidth > 0) {
      console.log('Creating stroke mask with strokeEnabled:', strokeEnabled, 'strokeWidth:', strokeWidth);
      strokeMaskPromiseRef.current = createSVGMask(width, height, 'stroke', strokeWidth);
      strokeMaskRef.current = null;
    } else {
      console.log('Not creating stroke mask. strokeEnabled:', strokeEnabled, 'strokeWidth:', strokeWidth);
      strokeMaskPromiseRef.current = null;
      strokeMaskRef.current = null;
    }
    
    return fillMaskPromiseRef.current;
  }, []);

  const getFillMask = useCallback(async (): Promise<ImageData> => {
    if (fillMaskRef.current) {
      return fillMaskRef.current;
    }
    if (fillMaskPromiseRef.current) {
      fillMaskRef.current = await fillMaskPromiseRef.current;
      return fillMaskRef.current;
    }
    throw new Error('Fill mask not initialized');
  }, []);

  const getStrokeMask = useCallback(async (): Promise<ImageData | null> => {
    if (strokeMaskRef.current) {
      return strokeMaskRef.current;
    }
    if (strokeMaskPromiseRef.current) {
      strokeMaskRef.current = await strokeMaskPromiseRef.current;
      return strokeMaskRef.current;
    }
    return null;
  }, []);

  return { createMask, getFillMask, getStrokeMask };
};