
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hand } from "@/components/ui/hand";
import { Video, Mic, MicOff, VideoOff, Phone } from "lucide-react";
import { getGestureTranslation } from "@/utils/gestureTranslations";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [currentGesture, setCurrentGesture] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera permission at component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Just check if permissions are available
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
      } catch (err) {
        console.error("Permission check failed:", err);
        setHasPermission(false);
        toast({
          title: "Camera Access Required",
          description: "Please allow camera access for this application to work.",
          variant: "destructive",
        });
      }
    };

    checkPermissions();
  }, []);

  // Handle starting the video call
  const startCall = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        // Store the stream reference
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        
        // Enable or disable audio based on initial state
        stream.getAudioTracks().forEach(track => {
          track.enabled = isAudioOn;
        });
        
        setIsVideoOn(true);
        setIsCallActive(true);
        
        // Simulate gesture detection
        simulateGestureDetection();
        
        toast({
          title: "Call Started",
          description: "Your camera and microphone are now active.",
        });
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast({
        title: "Failed to start call",
        description: "Please check your camera and microphone permissions.",
        variant: "destructive",
      });
    }
  };

  // Handle ending the call
  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsVideoOn(false);
      setIsCallActive(false);
      setCurrentGesture("");
      
      toast({
        title: "Call Ended",
        description: "Your camera and microphone have been turned off.",
      });
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
      
      toast({
        title: isAudioOn ? "Microphone Muted" : "Microphone Unmuted",
        description: isAudioOn ? "Others can't hear you now." : "Others can hear you now.",
      });
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
      
      toast({
        title: isVideoOn ? "Camera Turned Off" : "Camera Turned On",
        description: isVideoOn ? "Others can't see you now." : "Others can see you now.",
      });
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

  // Get the current gesture translation
  const gestureTranslation = getGestureTranslation(currentGesture);

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
                {hasPermission ? (
                  <p className="text-white">Start call to activate camera</p>
                ) : (
                  <p className="text-white">Camera permission required</p>
                )}
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
              aria-label={isAudioOn ? "Mute microphone" : "Unmute microphone"}
            >
              {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
            </Button>
            
            {!isCallActive ? (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={startCall}
                disabled={!hasPermission}
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
              aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Gesture Translation</CardTitle>
          </CardHeader>
          <CardContent>
            {isCallActive && currentGesture ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Detected Gesture:</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{currentGesture}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Meaning:</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">{gestureTranslation.meaning}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{gestureTranslation.description}</p>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {isCallActive 
                  ? "Waiting for gesture detection..." 
                  : "Start a call to see gesture translations"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
