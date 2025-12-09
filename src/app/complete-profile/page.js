"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  PenTool,
  Upload,
  Trash2,
  Home,
  ArrowRight,
  FileImage,
  Heart,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { completeProfile } from "@/lib/api";

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("pending"); // pending, success, error
  const [errorMessage, setErrorMessage] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    marital_status: "",
    visa_eligible: "",
  });

  // Signature state
  const [signatureMethod, setSignatureMethod] = useState("draw"); // draw or upload
  const [signatureFile, setSignatureFile] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      // Set white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [signatureMethod]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Canvas drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawnSignature(false);
    }
    setSignatureFile(null);
  };

  // File upload for signature
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        setSignatureFile(file);
      } else {
        alert("Please upload an image file (JPG, PNG) only");
      }
    }
  };

  // Convert canvas to file
  const canvasToFile = () => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      canvas.toBlob((blob) => {
        const file = new File([blob], "signature.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.marital_status || !formData.visa_eligible) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    // Validate signature
    if (signatureMethod === "draw" && !hasDrawnSignature) {
      setErrorMessage("Please draw your signature");
      return;
    }

    if (signatureMethod === "upload" && !signatureFile) {
      setErrorMessage("Please upload your signature");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const apiFormData = new FormData();
      apiFormData.append("token", token);
      apiFormData.append("marital_status", formData.marital_status);
      apiFormData.append("visa_eligible", formData.visa_eligible);

      // Get signature file
      let sigFile;
      if (signatureMethod === "draw") {
        sigFile = await canvasToFile();
      } else {
        // Rename uploaded file to "signature"
        const ext = signatureFile.name.split(".").pop();
        sigFile = new File([signatureFile], `signature.${ext}`, { type: signatureFile.type });
      }
      apiFormData.append("signature", sigFile);

      const result = await completeProfile(apiFormData);

      if (result.success) {
        setStatus("success");
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to complete profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
            <p className="text-muted-foreground mb-8">
              No authorization token was provided. Please use the link from your email.
            </p>
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-4 text-green-600">Profile Completed!</h1>
              <p className="text-muted-foreground mb-6">
                Congratulations! Your profile has been successfully completed. Our admin team will
                review your information and get in touch with you soon.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-8"
              >
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">All information submitted successfully</span>
                </div>
              </motion.div>

              <p className="text-sm text-muted-foreground mb-4">
                Redirecting to home page in 3 seconds...
              </p>

              <Button asChild className="gradient-primary text-white">
                <Link href="/">
                  Go to Home Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Submission Failed</h1>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t complete your profile submission.
            </p>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-8">
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setStatus("pending")}
                className="gradient-primary text-white"
              >
                Try Again
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen pt-32 pb-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <PenTool className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Please provide the following information and your signature to complete your application.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                All fields are required to complete your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Marital Status */}
                <div className="space-y-2">
                  <Label htmlFor="marital_status" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    Marital Status *
                  </Label>
                  <Select
                    value={formData.marital_status}
                    onValueChange={(value) => handleInputChange("marital_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Visa Eligibility */}
                <div className="space-y-2">
                  <Label htmlFor="visa_eligible" className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-muted-foreground" />
                    Visa Eligibility *
                  </Label>
                  <Select
                    value={formData.visa_eligible}
                    onValueChange={(value) => handleInputChange("visa_eligible", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Are you eligible for a visa?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I am eligible</SelectItem>
                      <SelectItem value="no">No, I am not eligible</SelectItem>
                      <SelectItem value="not_sure">Not sure / Need guidance</SelectItem>
                      <SelectItem value="already_have">I already have a visa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Signature Section */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-muted-foreground" />
                    Your Signature *
                  </Label>

                  <Tabs value={signatureMethod} onValueChange={(v) => { setSignatureMethod(v); clearSignature(); }}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="draw">Draw Signature</TabsTrigger>
                      <TabsTrigger value="upload">Upload Image</TabsTrigger>
                    </TabsList>

                    <TabsContent value="draw" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Use your mouse or finger to draw your signature below
                      </p>
                      <div className="border-2 border-dashed rounded-lg overflow-hidden bg-white">
                        <canvas
                          ref={canvasRef}
                          width={500}
                          height={200}
                          className="w-full cursor-crosshair touch-none"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearSignature}
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Signature
                      </Button>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Upload an image of your signature (JPG, PNG)
                      </p>

                      {signatureFile ? (
                        <div className="border-2 border-dashed rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileImage className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{signatureFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(signatureFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setSignatureFile(null)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-2">
                            Click to upload your signature
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG (max 5MB)
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary text-white"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">
            Please wait while we load your profile form.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main export wrapped in Suspense
export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CompleteProfileContent />
    </Suspense>
  );
}
