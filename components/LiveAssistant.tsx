import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Volume2, Loader2 } from 'lucide-react';
import { GoogleGenAI, LiveSession, Modality } from "@google/genai";

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

export const LiveAssistant: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [volume, setVolume] = useState(0); // For basic visualization

    const sessionRef = useRef<LiveSession | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const stopSession = () => {
        if (sessionRef.current) {
            sessionRef.current.close();
            sessionRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        sourcesRef.current.forEach(source => source.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        setIsActive(false);
        setIsConnecting(false);
        setVolume(0);
    };

    const startSession = async () => {
        setIsConnecting(true);
        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) throw new Error("API Key not found");

            // Initialize Audio Contexts
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: "You are Kasipedia's helpful voice assistant. Keep your responses concise, informative, and suitable for an encyclopedia audience. Use a neutral, slightly formal but engaging tone.",
                },
                callbacks: {
                    onopen: () => {
                        setIsActive(true);
                        setIsConnecting(false);
                        
                        if (!inputAudioContextRef.current || !mediaStreamRef.current) return;

                        const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                        // Using ScriptProcessor for simplicity in this environment, though AudioWorklet is modern preferred
                        const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = processor;

                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            
                            // Calculate volume for visualization
                            let sum = 0;
                            for (let i = 0; i < inputData.length; i++) {
                                sum += inputData[i] * inputData[i];
                            }
                            setVolume(Math.sqrt(sum / inputData.length));

                            // Convert to 16-bit PCM
                            const pcmInt16 = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) {
                                // Clamp and scale to Int16 range
                                let s = Math.max(-1, Math.min(1, inputData[i]));
                                pcmInt16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                            }

                            const base64Data = encode(new Uint8Array(pcmInt16.buffer));

                            sessionPromise.then(session => {
                                session.sendRealtimeInput({
                                    media: {
                                        mimeType: 'audio/pcm;rate=16000',
                                        data: base64Data
                                    }
                                });
                            });
                        };

                        source.connect(processor);
                        processor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message) => {
                        if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
                            const audioData = message.serverContent.modelTurn.parts[0].inlineData.data;
                             if (outputAudioContextRef.current) {
                                const ctx = outputAudioContextRef.current;
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

                                const audioBuffer = await decodeAudioData(
                                    decode(audioData),
                                    ctx,
                                    24000,
                                    1
                                );

                                const source = ctx.createBufferSource();
                                source.buffer = audioBuffer;
                                source.connect(ctx.destination);
                                source.addEventListener('ended', () => {
                                    sourcesRef.current.delete(source);
                                });

                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += audioBuffer.duration;
                                sourcesRef.current.add(source);
                            }
                        }
                        
                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(source => source.stop());
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onclose: () => {
                        stopSession();
                    },
                    onerror: (err) => {
                        console.error("Live session error:", err);
                        stopSession();
                    }
                }
            });
            
            sessionRef.current = await sessionPromise;

        } catch (error) {
            console.error("Failed to start live session:", error);
            stopSession();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopSession();
        };
    }, []);

    if (!isActive && !isConnecting) {
        return (
            <button
                onClick={startSession}
                className="fixed bottom-6 right-6 h-14 w-14 bg-wiki-blue text-slate-900 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-400 transition-all z-50 group"
                aria-label="Start Voice Assistant"
            >
                <Mic size={24} />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Talk to Kasipedia
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-72 bg-wiki-dark border border-wiki-border rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-wiki-border">
                <h3 className="font-serif font-bold text-slate-200 flex items-center gap-2">
                    <Volume2 size={18} className="text-wiki-blue" />
                    Voice Assistant
                </h3>
                <button onClick={stopSession} className="text-slate-400 hover:text-slate-200 transition-colors">
                    <X size={20} />
                </button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center gap-4">
                {isConnecting ? (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Loader2 className="animate-spin text-wiki-blue" size={32} />
                        <p className="text-sm">Connecting...</p>
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            {/* Simple visualizer based on volume */}
                            <div 
                                className="absolute inset-0 bg-wiki-blue/30 rounded-full blur-md transition-all duration-75"
                                style={{ transform: `scale(${1 + volume * 2})` }}
                            />
                            <div className="relative h-16 w-16 bg-wiki-blue rounded-full flex items-center justify-center text-slate-900">
                                <Mic size={32} />
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm font-medium">Listening...</p>
                        <button 
                            onClick={stopSession}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-200 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-red-900/80 transition-colors"
                        >
                            <MicOff size={14} /> End Session
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};