"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Shield,
  UserCheck,
  Home,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { acceptApplication } from "@/lib/api";

function AcceptApplicationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("pending"); // pending, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Show confirmation dialog when page loads with token
    if (token) {
      setShowConfirmDialog(true);
    }
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;

    setIsProcessing(true);
    setShowConfirmDialog(false);

    try {
      const result = await acceptApplication(token);

      if (result.success) {
        setStatus("success");
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to accept application");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    router.push("/");
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
              No authorization token was provided. Please use the link from your admin email.
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

  // Processing state
  if (isProcessing) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Processing...</h1>
            <p className="text-muted-foreground">
              Please wait while we process the application acceptance.
            </p>
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
              <h1 className="text-3xl font-bold mb-4 text-green-600">Application Accepted!</h1>
              <p className="text-muted-foreground mb-6">
                The application has been successfully accepted. An email has been sent to the
                student with instructions to complete their profile.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-8"
              >
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Student notification sent</span>
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
            <h1 className="text-2xl font-bold mb-4 text-red-600">Acceptance Failed</h1>
            <p className="text-muted-foreground mb-4">
              We couldn&apos;t process the application acceptance.
            </p>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-8">
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  setStatus("pending");
                  setShowConfirmDialog(true);
                }}
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

  // Default pending state with dialog
  return (
    <div className="min-h-screen pt-32 pb-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Admin Action Required</CardTitle>
              <CardDescription>
                You are about to accept a student application
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Click the button below to review and confirm the acceptance of this application.
              </p>
              <Button
                onClick={() => setShowConfirmDialog(true)}
                className="gradient-primary text-white"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Review Application
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Accept Application?</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to accept this student&apos;s application? This action will:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <span>Mark the application as accepted in the system</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <span>Send a congratulatory email to the student</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <span>Provide the student with a link to complete their profile</span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleAccept} className="gradient-primary text-white">
              <CheckCircle className="mr-2 h-4 w-4" />
              Yes, Accept Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main export wrapped in Suspense
export default function AcceptApplicationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AcceptApplicationContent />
    </Suspense>
  );
}
