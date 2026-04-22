import { useState, useRef, useCallback, useEffect } from 'react';

const WAVEFORM_BARS = 32;

export function useRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(WAVEFORM_BARS).fill(0));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const animateWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const bars = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
      const idx = Math.floor((i / WAVEFORM_BARS) * data.length);
      return data[idx] / 255;
    });
    setWaveformData(bars);
    animFrameRef.current = requestAnimationFrame(animateWaveform);
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    const mr = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mr.start(100);
    mediaRecorderRef.current = mr;
    setIsRecording(true);
    setDuration(0);
    setWaveformData(Array(WAVEFORM_BARS).fill(0));

    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    animateWaveform();
  }, [animateWaveform]);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const mr = mediaRecorderRef.current;
      if (!mr || !isRecording) {
        resolve(new Blob([], { type: 'audio/webm' }));
        return;
      }

      mr.addEventListener(
        'stop',
        () => {
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
          streamRef.current?.getTracks().forEach((t) => t.stop());
          audioContextRef.current?.close();
          resolve(blob);
        },
        { once: true }
      );

      mr.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setWaveformData(Array(WAVEFORM_BARS).fill(0));
    });
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return { isRecording, duration, waveformData, startRecording, stopRecording };
}
