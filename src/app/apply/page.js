"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  X,
  Loader2,
  FileImage,
  CreditCard,
  Award,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { courses } from "@/lib/data";
import { submitApplication } from "@/lib/api";

const steps = [
  { id: 1, title: "Personal Info", description: "Basic details" },
  { id: 2, title: "Course Selection", description: "Choose program" },
  { id: 3, title: "Documents", description: "Upload files" },
];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [submitError, setSubmitError] = useState("");

  // File uploads
  const [files, setFiles] = useState({
    result_card_1: null,
    result_card_2: null,
    cnic: null,
    certificate: null,
    passport: null,
  });

  const [dragActive, setDragActive] = useState({
    result_card_1: false,
    result_card_2: false,
    cnic: false,
    certificate: false,
    passport: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedCourse: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const handleDrag = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [fieldName]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [fieldName]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], fieldName);
    }
  };

  const handleFileInput = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], fieldName);
    }
  };

  const handleFile = (file, fieldName) => {
    // Accept images and PDFs
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedTypes.includes(file.type)) {
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
    } else {
      alert("Please upload an image (JPG, PNG) or PDF file only");
    }
  };

  const removeFile = (fieldName) => {
    setFiles((prev) => ({ ...prev, [fieldName]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only submit on step 3
    if (currentStep !== 3) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Build FormData for API
      const apiFormData = new FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("email", formData.email);
      if (formData.phone) {
        apiFormData.append("phone", formData.phone);
      }

      // Append files if they exist
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          apiFormData.append(key, files[key]);
        }
      });

      const result = await submitApplication(apiFormData);

      if (result.success) {
        setApplicationId(result.data.application_id);
        setIsSubmitted(true);
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = (e) => {
    e?.preventDefault();
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = (e) => {
    e?.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = formData.name && formData.email;
  const canProceedStep2 = formData.selectedCourse;

  const fileUploadConfigs = [
    { key: "result_card_1", label: "Result Card (10th/Matric)", icon: FileText },
    { key: "result_card_2", label: "Result Card (12th/Intermediate)", icon: FileText },
    { key: "cnic", label: "CNIC / National ID", icon: CreditCard },
    { key: "certificate", label: "Certificate (if any)", icon: Award },
    { key: "passport", label: "Passport (if available)", icon: Plane },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-4"
            >
              Application Submitted!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-muted-foreground mb-4">
                Thank you for applying to EduVerse. We have received your application
                and will review it shortly.
              </p>

              {applicationId && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Application ID</p>
                  <p className="font-mono font-bold text-lg">{applicationId}</p>
                </div>
              )}

              <p className="text-muted-foreground mb-8">
                A confirmation email has been sent to{" "}
                <span className="font-medium text-foreground">{formData.email}</span>.
                Our admin team will review your application and get back to you soon.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild className="gradient-primary text-white">
                <Link href="/courses">Explore More Courses</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=2074"
            alt="Students applying for admission"
            fill
            className="object-cover"
            priority
          />
          {/* Multi-layer Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-indigo-950/80 to-violet-950/90" />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/30" />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 z-1">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-white border border-white/20">
              Admissions Open 2025
            </Badge>
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              Apply for Admission
            </h1>
            <p
              className="text-lg text-white/90 drop-shadow-md"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              Take the first step towards your dream career. Fill out the application
              form below and our admissions team will get back to you soon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="mt-2 text-center hidden sm:block">
                      <div className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-full h-1 mx-2 rounded ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                      style={{ minWidth: "40px", maxWidth: "100px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {currentStep === 1 && "Please provide your personal information"}
                {currentStep === 2 && "Select your preferred program"}
                {currentStep === 3 && "Upload required documents (all optional)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+92 300 1234567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Course Selection */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="selectedCourse">Select Course *</Label>
                      <Select
                        value={formData.selectedCourse}
                        onValueChange={(value) => handleSelectChange("selectedCourse", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a program" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title} - {course.level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.selectedCourse && (
                      <div className="p-4 rounded-lg bg-muted/50 border">
                        {(() => {
                          const selected = courses.find(c => c.id === formData.selectedCourse);
                          return selected && (
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${selected.color} flex items-center justify-center shrink-0`}>
                                <GraduationCap className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{selected.title}</h4>
                                <p className="text-sm text-muted-foreground">{selected.shortDescription}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span>{selected.duration}</span>
                                  <span>{selected.price}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Upload your documents below. All files are optional but help us process your application faster.
                        Accepted formats: JPG, PNG, PDF (max 10MB each)
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {fileUploadConfigs.map(({ key, label, icon: Icon }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <div
                            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                              dragActive[key]
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onDragEnter={(e) => handleDrag(e, key)}
                            onDragLeave={(e) => handleDrag(e, key)}
                            onDragOver={(e) => handleDrag(e, key)}
                            onDrop={(e) => handleDrop(e, key)}
                          >
                            {files[key] ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <FileImage className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium text-sm truncate max-w-[200px]">
                                      {files[key].name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(files[key].size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(key)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-4">
                                <Icon className="h-6 w-6 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">
                                  Drag & drop or{" "}
                                  <label className="text-primary cursor-pointer hover:underline">
                                    browse
                                    <input
                                      type="file"
                                      accept=".jpg,.jpeg,.png,.pdf"
                                      onChange={(e) => handleFileInput(e, key)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Summary */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Application Summary</h3>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{formData.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Course:</span>
                          <p className="font-medium">
                            {courses.find(c => c.id === formData.selectedCourse)?.title || "-"}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-muted-foreground">Documents Uploaded:</span>
                          <p className="font-medium">
                            {Object.values(files).filter(Boolean).length} file(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800 dark:text-red-200">
                          {submitError}
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-2 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                      <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        By submitting this application, you confirm that all information
                        provided is accurate and complete. Our admin team will review your
                        application and contact you via email.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => prevStep(e)}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={(e) => nextStep(e)}
                      className="gradient-primary text-white"
                      disabled={
                        (currentStep === 1 && !canProceedStep1) ||
                        (currentStep === 2 && !canProceedStep2)
                      }
                    >
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gradient-primary text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
