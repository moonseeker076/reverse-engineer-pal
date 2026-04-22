import { useState, useRef, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export const webSpeechSupported =
  typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition);

export function useWebSpeech() {
  const [liveTranscript, setLiveTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalRef = useRef('');

  const startListening = useCallback(() => {
    if (!webSpeechSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    finalRef.current = '';
    setLiveTranscript('');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = finalRef.current;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      finalRef.current = final;
      setLiveTranscript((final + interim).trim());
    };

    recognition.onerror = () => {
      // Silently handle errors — Web Speech may fail in some environments
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopListening = useCallback((): string => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    return finalRef.current.trim();
  }, []);

  return { liveTranscript, startListening, stopListening };
}
