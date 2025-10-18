import { useEffect, useRef } from 'react';

import { findPeaks } from '../MosquitoAnalyzer';

type Props = {
    array: number[],
}

export default function Spectrum({array}: Props) {
  let canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (array.length == 0)
      return;
    if (canvasRef.current == null)
      return;

    let ctx = canvasRef.current.getContext("2d");
    if (ctx == null)
      return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 400, 200);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2/3;
    for(let i=0; i<700 && i<array.length; i++) {
      ctx.beginPath();
      ctx.moveTo(i*2/3, 200);
      ctx.lineTo(i*2/3, 200 - array[i]*5);
      ctx.stroke();
      ctx.closePath();
    }

    let peaks = findPeaks(array);

    
    ctx.strokeStyle="#FF0000";
    for(let p of peaks) {
      ctx.beginPath();
      ctx.moveTo(p*2/3, 0);
      ctx.lineTo(p*2/3, 200);
      ctx.stroke();
      ctx.closePath();
    }
  }, [array])

  return <>
    <canvas 
      ref={canvasRef}
      width={400}
      height={200} />
  </>
}