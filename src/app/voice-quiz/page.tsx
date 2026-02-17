"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Loader2, Volume2, Globe, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getRealtimeSession } from "@/app/actions/realtime";

export default function VoiceQuizPage() {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState("Suhbatni boshlash uchun tugmani bosing...");

    // Audio visualization state
    const [audioLevel, setAudioLevel] = useState(0);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Initialize audio analyzer for visualization
    const setupAudioAnalyzer = (stream: MediaStream) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyser);
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
            setAudioLevel(average);
            animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
    };

    async function startSession() {
        try {
            setIsConnecting(true);
            setError(null);

            // 1. Get ephemeral token from server
            const data = await getRealtimeSession();
            const ephemeralToken = data.client_secret.value;

            // 2. Setup Peer Connection
            const pc = new RTCPeerConnection();
            pcRef.current = pc;

            // Handle remote audio stream
            pc.ontrack = (e) => {
                if (audioElementRef.current) {
                    audioElementRef.current.srcObject = e.streams[0];
                }
            };

            // 3. Get Microphone access and add track
            const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = ms;
            pc.addTrack(ms.getTracks()[0]);

            // Setup analyzer for local stream visualization
            setupAudioAnalyzer(ms);

            // 4. Create Data Channel for events (transcripts, etc)
            const dc = pc.createDataChannel("oai-events");
            dc.onmessage = (e) => {
                const event = JSON.parse(e.data);

                // Track transcripts if available
                if (event.type === "response.audio_transcript.delta") {
                    setTranscript(prev => prev === "Eshitilyapti..." ? event.delta : prev + event.delta);
                }
                if (event.type === "input_audio_buffer.speech_started") {
                    setIsTalking(false);
                    setTranscript("Eshitilyapti...");
                }
                if (event.type === "response.created") {
                    setIsTalking(true);
                }
            };

            // 5. Create Offer and set local description
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // 6. Connect to OpenAI Realtime WebRTC endpoint
            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-realtime-preview";
            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${ephemeralToken}`,
                    "Content-Type": "application/sdp",
                },
            });

            if (!sdpResponse.ok) {
                throw new Error("OpenAI WebRTC endpointiga ulanishda xatolik yuz berdi");
            }

            const answer: RTCSessionDescriptionInit = {
                type: "answer",
                sdp: await sdpResponse.text(),
            };

            // 7. Set remote description
            await pc.setRemoteDescription(answer);

            setIsConnected(true);
            setTranscript("Ulandik! Gid siz bilan gaplashishga tayyor...");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "AI bilan ulanishda xatolik");
            stopSession();
        } finally {
            setIsConnecting(false);
        }
    }

    function stopSession() {
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        setIsConnected(false);
        setIsTalking(false);
        setTranscript("Suhbat yakunlandi.");
        setAudioLevel(0);
    }

    useEffect(() => {
        return () => stopSession();
    }, []);

    // Calculate dynamic scaling for visualizer based on audio level
    // Normalize audioLevel (0-255) to a scale factor (e.g., 1.0 to 1.5)
    // Smoothing could be applied, but direct mapping works for responsiveness
    // isTalking (AI talking) might not trigger local microphone analyzer properly if not mixing, 
    // but we can simulate activity or use separate analyzer for remote stream if we want full accuracy.
    // For now, let's use a base pulse if connected + dynamic if mic usage.

    const visualizerScale = 1 + (audioLevel / 50);
    const visualizerColor = isConnected
        ? (isTalking ? 'bg-indigo-500 shadow-[0_0_60px_rgba(99,102,241,0.6)]' : 'bg-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.6)]')
        : 'bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]';

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans text-slate-100 selection:bg-indigo-500/30">
            <audio ref={audioElementRef} autoPlay />

            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[900px] h-[900px] rounded-full bg-indigo-600/20 blur-[120px] animate-blob mix-blend-screen opacity-70"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] rounded-full bg-purple-600/20 blur-[120px] animate-blob animation-delay-2000 mix-blend-screen opacity-70"></div>
                <div className="absolute top-[40%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[100px] animate-blob animation-delay-4000 mix-blend-screen opacity-50"></div>
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 md:p-8 w-full max-w-7xl mx-auto">
                <Link href="/" className="group flex items-center gap-2 text-indigo-200/80 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 hover:border-white/20">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-medium text-sm tracking-wide">Orqaga</span>
                </Link>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                    <Globe size={14} className="text-indigo-400" />
                    <span className="text-xs font-semibold tracking-wider text-indigo-200 uppercase">O'zbek Tili</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-20 md:mt-0">

                {/* Title Section */}
                <div className="mb-12 space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <Sparkles size={12} />
                        <span>AI Ovozli Gid</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200 drop-shadow-2xl">
                        Sayohat Gidingiz
                    </h1>
                    <p className="text-indigo-200/70 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        {isConnected
                            ? "Gapiring, AI sizni tinglamoqda va savollaringizga javob beradi."
                            : "O'zbekistonning boy tarixi va madaniyati haqida so'rang."}
                    </p>
                </div>

                {/* Interactive Visualizer Area */}
                <div className="relative mb-14 group">
                    {/* Outer Glow Rings */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-indigo-500/20 transition-opacity duration-1000 ${isConnected ? 'animate-[spin_10s_linear_infinite] opacity-100' : 'opacity-20'}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-purple-500/20 transition-opacity duration-1000 ${isConnected ? 'animate-[spin_15s_linear_infinite_reverse] opacity-100' : 'opacity-20'}`}></div>

                    {/* Core Visualizer */}
                    <div className="relative z-20">
                        <div
                            className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mx-auto transition-all duration-300 relative ${visualizerColor}`}
                            style={{
                                transform: isConnected ? `scale(${visualizerScale})` : 'scale(1)',
                                boxShadow: isConnected ? `0 0 ${30 + (audioLevel)}px ${isTalking ? 'rgba(99,102,241,0.5)' : 'rgba(16,185,129,0.5)'}` : ''
                            }}
                        >
                            {isConnecting ? (
                                <Loader2 size={48} className="animate-spin text-white drop-shadow-lg" />
                            ) : isConnected ? (
                                isTalking ? (
                                    <Volume2 size={48} className="text-white animate-pulse drop-shadow-lg" />
                                ) : (
                                    <Mic size={48} className="text-white drop-shadow-lg" />
                                )
                            ) : (
                                <MicOff size={48} className="text-white/50" />
                            )}

                            {/* Pulse Effect when connected */}
                            {isConnected && (
                                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse opacity-50"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Control Button */}
                <div className="w-full max-w-xs mx-auto mb-10 relative z-30">
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center justify-center gap-2 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={isConnected ? stopSession : startSession}
                        disabled={isConnecting}
                        className={`group relative w-full py-4 px-8 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-95 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
                            ${isConnected
                                ? 'bg-gradient-to-r from-red-500/80 to-pink-600/80 hover:from-red-600 hover:to-pink-700 text-white border border-white/10'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-white/10 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)]'}`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isConnecting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Ulanilmoqda...
                                </span>
                            ) : isConnected ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                    Suhbatni Yakunlash
                                </>
                            ) : (
                                <>
                                    <Mic size={18} className="group-hover:scale-110 transition-transform" />
                                    Gapirishni Boshlash
                                </>
                            )}
                        </span>

                        {/* Button Glow Effect */}
                        {!isConnected && !isConnecting && (
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        )}
                    </button>
                </div>

                {/* Transcript Card */}
                <div className="w-full max-w-2xl mx-auto transform transition-all duration-500 hover:scale-[1.01]">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>

                        <div className="flex items-center gap-3 mb-4 opacity-60">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`}></div>
                            <p className="text-[10px] text-indigo-200 uppercase tracking-[0.2em] font-bold">Jonli Transkript</p>
                        </div>

                        <p className="text-lg md:text-xl font-medium leading-relaxed text-indigo-50 min-h-[3rem] transition-all">
                            "{transcript}"
                        </p>

                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                    </div>
                </div>

            </main>

            <footer className="relative z-10 py-6 text-center">
                <p className="text-indigo-400/40 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-indigo-400/60 transition-colors cursor-default">
                    Powered by OpenAI Realtime
                </p>
            </footer>
        </div>
    );
}
