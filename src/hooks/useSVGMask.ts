import { useRef, useCallback } from 'react';
import { createSVGMask, createSVGBackgroundLayer } from '../utils/canvasUtils';

export const useSVGMask = () => {
  const fillMaskRef = useRef<ImageData | null>(null);
  const fillMaskPromiseRef = useRef<Promise<ImageData> | null>(null);
  const strokeMaskRef = useRef<ImageData | null>(null);
  const strokeMaskPromiseRef = useRef<Promise<ImageData> | null>(null);
  const backgroundLayerRef = useRef<ImageData | null>(null);
  const backgroundLayerPromiseRef = useRef<Promise<ImageData> | null>(null);

  const createMask = useCallback(async (width: number, height: number, strokeEnabled: boolean, strokeWidth: number) => {
    fillMaskPromiseRef.current = createSVGMask(width, height);
    fillMaskRef.current = null;
    
    backgroundLayerPromiseRef.current = createSVGBackgroundLayer(width, height);
    backgroundLayerRef.current = null;
    
    if (strokeEnabled) {
      strokeMaskPromiseRef.current = createSVGMask(width, height, 'stroke');
      strokeMaskRef.current = null;
    } else {
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
    if (!strokeMaskPromiseRef.current) {
      return null;
    }
    if (strokeMaskRef.current) {
      return strokeMaskRef.current;
    }
    strokeMaskRef.current = await strokeMaskPromiseRef.current;
    return strokeMaskRef.current;
  }, []);

  const getBackgroundLayer = useCallback(async (): Promise<ImageData> => {
    if (backgroundLayerRef.current) {
      return backgroundLayerRef.current;
    }
    if (backgroundLayerPromiseRef.current) {
      backgroundLayerRef.current = await backgroundLayerPromiseRef.current;
      return backgroundLayerRef.current;
    }
    throw new Error('Background layer not initialized');
  }, []);

  return { createMask, getFillMask, getStrokeMask, getBackgroundLayer };
};