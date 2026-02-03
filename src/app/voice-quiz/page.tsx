"use client";

import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getRealtimeSession } from "@/app/actions/realtime";

export default function VoiceQuizPage() {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState("Press start to begin the conversation...");

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

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

            // 4. Create Data Channel for events (transcripts, etc)
            const dc = pc.createDataChannel("oai-events");
            dc.onmessage = (e) => {
                const event = JSON.parse(e.data);

                // Track transcripts if available
                if (event.type === "response.audio_transcript.delta") {
                    setTranscript(prev => prev === "Listening..." ? event.delta : prev + event.delta);
                }
                if (event.type === "input_audio_buffer.speech_started") {
                    setIsTalking(false);
                    setTranscript("Listening...");
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
                throw new Error("Failed to connect to OpenAI WebRTC endpoint");
            }

            const answer: RTCSessionDescriptionInit = {
                type: "answer",
                sdp: await sdpResponse.text(),
            };

            // 7. Set remote description
            await pc.setRemoteDescription(answer);

            setIsConnected(true);
            setTranscript("Connected! The tour guide is ready...");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to connect to AI");
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
        setIsConnected(false);
        setIsTalking(false);
        setTranscript("Session ended.");
    }

    useEffect(() => {
        return () => stopSession();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col p-6 font-sans text-white">
            <audio ref={audioElementRef} autoPlay />

            {/* Header */}
            <header className="flex items-center mb-8">
                <Link href="/" className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-semibold text-sm">Back</span>
                </Link>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">

                    {/* Visualizer / Avatar Area */}
                    <div className="relative mb-12">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all duration-500 relative z-10 
                            ${isConnected ? (isTalking ? 'bg-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.8)]' : 'bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]') : 'bg-white/10'}`}>
                            {isConnecting ? (
                                <Loader2 size={48} className="animate-spin text-white" />
                            ) : isConnected ? (
                                <Mic size={48} className="text-white animate-pulse" />
                            ) : (
                                <MicOff size={48} className="text-white/40" />
                            )}
                        </div>

                        {/* Pulse rings for active talking */}
                        {isTalking && isConnected && (
                            <>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-indigo-400 animate-ping opacity-75"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-indigo-500 animate-[ping_2s_infinite] opacity-50"></div>
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl font-black mb-3 tracking-tight">AI Voice Guide</h1>
                    <p className="text-indigo-200 text-sm mb-10 opacity-80 leading-relaxed">
                        {isConnected
                            ? "The AI is listening and will respond based on your custom prompt."
                            : "Speak with your personalized AI travel expert."}
                    </p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={isConnected ? stopSession : startSession}
                        disabled={isConnecting}
                        className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all transform active:scale-95 shadow-xl disabled:opacity-50
                            ${isConnected
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20'}`}
                    >
                        {isConnecting ? 'Establishing Connection...' : isConnected ? 'End Conversation' : 'Start Talking'}
                    </button>

                    <div className="mt-8 p-6 bg-black/40 rounded-3xl border border-white/5 text-left">
                        <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] mb-3 font-black opacity-60">Live Response</p>
                        <p className="text-sm font-medium leading-relaxed min-h-[4rem] text-indigo-50">
                            {transcript}
                        </p>
                    </div>
                </div>
            </div>

            <footer className="mt-8 text-center text-indigo-300/40 text-[10px] uppercase tracking-widest font-bold">
                Powered by OpenAI Realtime WebRTC
            </footer>
        </div>
    );
}
