
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hand } from "@/components/ui/hand";
import { Video, Mic, MicOff, VideoOff, Phone } from "lucide-react";

const Index = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [currentGesture, setCurrentGesture] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  // Handle starting the video call
  const startCall = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isAudioOn
        });
        videoRef.current.srcObject = stream;
        setIsVideoOn(true);
        setIsCallActive(true);
        
        // Simulate gesture detection
        simulateGestureDetection();
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Handle ending the call
  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsVideoOn(false);
      setIsCallActive(false);
      setCurrentGesture("");
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  // Simulate gesture detection (for demo purposes)
  const simulateGestureDetection = () => {
    const gestures = [
      "Wave",
      "Thumbs Up",
      "Peace Sign",
      "Pointing",
      "Open Palm",
      "No gesture detected"
    ];
    
    const gestureInterval = setInterval(() => {
      if (!isCallActive) {
        clearInterval(gestureInterval);
        return;
      }
      const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
      setCurrentGesture(randomGesture);
    }, 3000);

    return () => clearInterval(gestureInterval);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center">Video Call with Gesture Recognition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            {isCallActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!isAudioOn}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white">Camera off</p>
              </div>
            )}

            {/* Gesture recognition display */}
            <div className="absolute bottom-4 right-4">
              <Hand gesture={currentGesture} className="bg-white rounded-lg shadow-lg" />
            </div>
          </div>

          {/* Call controls */}
          <div className="flex justify-center space-x-4">
            <Button 
              variant={isAudioOn ? "default" : "outline"} 
              size="icon"
              onClick={toggleAudio}
              disabled={!isCallActive}
            >
              {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>
            
            {!isCallActive ? (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={startCall}
              >
                Start Call
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={endCall}
              >
                <Phone size={20} className="mr-2 rotate-135" />
                End Call
              </Button>
            )}
            
            <Button 
              variant={isVideoOn ? "default" : "outline"} 
              size="icon"
              onClick={toggleVideo}
              disabled={!isCallActive}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Detected Gestures</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This system simulates detecting hand gestures in real-time. In a production system, this would use actual computer vision models to detect gestures.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
