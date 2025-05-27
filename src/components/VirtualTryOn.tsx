
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, RotateCcw } from 'lucide-react';

interface VirtualTryOnProps {
  productId: string;
  productImages: string[];
  productType: 'clothing' | 'accessories' | 'shoes';
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  productId,
  productImages,
  productType
}) => {
  const [isActive, setIsActive] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setUserImage(imageData);
        processVirtualTryOn(imageData);
      }
    }
  };

  const processVirtualTryOn = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate AR processing - in production, integrate with AR SDK
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Send image to AR processing service
      // 2. Apply product overlay
      // 3. Return processed image
      
      console.log('Virtual try-on processing completed');
    } catch (error) {
      console.error('Virtual try-on error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUserImage(imageData);
        processVirtualTryOn(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Virtual Try-On
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && !userImage && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Try on this {productType} virtually using your camera or upload a photo
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={startCamera} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Use Camera
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        )}

        {isActive && (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
              />
              
              {/* Product overlay preview */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                  src={productImages[0]}
                  alt="Product overlay"
                  className="w-32 h-32 object-contain opacity-70"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                Capture
              </Button>
              <Button variant="outline" onClick={stopCamera}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {userImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={userImage}
                alt="Your photo"
                className="w-full rounded-lg"
              />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>Processing...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setUserImage(null);
                  setIsActive(false);
                }}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button className="flex-1">
                Add to Cart
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default VirtualTryOn;
