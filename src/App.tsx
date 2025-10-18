import { useEffect, useRef, useState } from 'react';
import './App.css'
import Meyda from "meyda";
import type { MeydaAnalyzer } from 'meyda/dist/esm/meyda-wa';
import Spectrum from './components/Spectrum';
import { scaleSequential } from 'd3-scale';
import { interpolateMagma } from 'd3-scale-chromatic';
import { blur } from 'd3-array';
import { isMosquito } from './MosquitoAnalyzer';

function App() {
  const [centroid, setCentroid] = useState(0);
  let [spectrum, setSpectrum] = useState<number[]>([]);
  let [mfcc, setMfcc] = useState<number[]>([]);

  //let audioContext: AudioContext | null = null;
  //let meydaAnalyzer: MeydaAnalyzer | null = null;
  let audioContext = useRef<AudioContext | null>(null);
  let meydaAnalyzer = useRef<MeydaAnalyzer | null>(null);

  useEffect(() => {
    audioContext.current = new AudioContext();
    let source: MediaStreamAudioSourceNode | null = null;

    async function setupAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log(stream);
        source = audioContext.current!.createMediaStreamSource(stream);

        meydaAnalyzer.current = Meyda.createMeydaAnalyzer({
          audioContext: audioContext.current!,
          source,
          bufferSize: 4096,
          featureExtractors: ['rms', 'zcr', 'amplitudeSpectrum', 'spectralCentroid', 'mfcc'], 
          callback: (features: any) => {
            if (features.rms == 0)
              return;

            const hz = features.spectralCentroid;
            const arr: number[] = Array.from(features.amplitudeSpectrum);
            const mfccArr: number[] = Array.from(features.mfcc);

            const smoothed = Array.from(blur(arr, 8));
            //console.log(features);

            // todo
            if(!isNaN(hz))
              setCentroid(hz as number);

            setSpectrum(smoothed);
            setMfcc(mfccArr);
          },
        });

        meydaAnalyzer.current!.start();
        console.log("Initialize success!!");
      }
      catch(e) {
        console.error("Error: ", e);
      }
    }

    setupAudio();

    return () => {
      if (meydaAnalyzer.current) meydaAnalyzer.current.stop();
      if (audioContext.current) audioContext.current.close();
    };
  }, []);

  const stopAudio = () => {
    if (meydaAnalyzer.current) meydaAnalyzer.current.stop();
    if (audioContext.current) audioContext.current.close();
  }

  const magma = scaleSequential(interpolateMagma).domain([0, 1]);

  return (
    <>
      <p>haha</p>
      <p>centroid: {centroid}</p>
      { isMosquito(spectrum) && <p>MOSQUITO!!!</p> }
      <p style={{display: 'flex', flexDirection: 'row', gap: '1px'}}>
        {
          mfcc.map(value => <div style={{width: '30px', height: '30px', backgroundColor: magma(value)}}></div>)
        }
      </p>
      <p>
        <Spectrum array={spectrum} />
      </p>
      <button onClick={stopAudio}>STOP</button>
    </>
  )
}

export default App
