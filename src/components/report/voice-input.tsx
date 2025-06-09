import React, { useRef, useState } from "react";
import { Mic, StopCircle } from "lucide-react";

export default function VoiceInput({
  onRecordingComplete,
}: {
  onRecordingComplete?: (audioBlob: Blob) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
        if (onRecordingComplete) onRecordingComplete(audioBlob);
        stopVisualizer();
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualizer(stream);
    } catch (err) {
      alert("Microphone access denied or not available.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Visualizer logic
  const startVisualizer = (stream: MediaStream) => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 32;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyserRef.current!.getByteFrequencyData(dataArray);
      // Use the average of the frequency data for a simple level
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      setAudioLevel(avg);
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stopVisualizer = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    audioContextRef.current?.close();
    setAudioLevel(0);
  };

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`rounded-full p-3 shadow-lg transition-colors ${
          isRecording ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}>
        {isRecording ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
      </button>
      {/* Visualizer bar, iOS style */}
      {isRecording && (
        <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden flex items-center">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{
              width: `${Math.min(100, audioLevel * 2)}%`,
              borderRadius: "9999px",
              transition: "width 0.1s",
            }}
          />
        </div>
      )}
      {isRecording && <span className="text-xs text-red-500 animate-pulse">Recording...</span>}
      {audioUrl && !isRecording && <audio controls src={audioUrl} className="mt-2" />}
    </div>
  );
}
