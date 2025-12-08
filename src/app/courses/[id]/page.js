"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  GraduationCap,
  Calendar,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { courses } from "@/lib/data";

const colorOverlays = {
  "from-violet-600 to-purple-600": "from-violet-950/90 via-purple-950/85 to-slate-950/90",
  "from-emerald-600 to-teal-600": "from-emerald-950/90 via-teal-950/85 to-slate-950/90",
  "from-cyan-600 to-blue-600": "from-cyan-950/90 via-blue-950/85 to-slate-950/90",
  "from-pink-600 to-rose-600": "from-pink-950/90 via-rose-950/85 to-slate-950/90",
  "from-orange-600 to-amber-600": "from-orange-950/90 via-amber-950/85 to-slate-950/90",
  "from-red-600 to-orange-600": "from-red-950/90 via-orange-950/85 to-slate-950/90",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function CourseDetailPage() {
  const params = useParams();
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  const overlayGradient = colorOverlays[course.color] || "from-slate-950/90 via-slate-950/85 to-slate-950/90";

  return (
    <div className="min-h-screen">
      {/* Hero Section with Dynamic Background Image */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={course.heroImage}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          {/* Dynamic Overlay Gradient based on course color */}
          <div className={`absolute inset-0 bg-gradient-to-br ${overlayGradient}`} />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl z-[1]"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-black/10 rounded-full blur-3xl z-[1]"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-0">
                {course.level}
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/80 mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="h-5 w-5" />
                  <span>{course.students} Students</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span>{course.rating} Rating</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-foreground hover:bg-white/90 px-8"
                >
                  <Link href="/apply">
                    Enroll Now
                    <GraduationCap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Link href="/contact">Request Info</Link>
                </Button>
              </div>
            </motion.div>

            {/* Course Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-white mb-2">
                      {course.price}
                    </div>
                    <p className="text-white/70">Full program fee</p>
                  </div>

                  <Separator className="bg-white/20 mb-6" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <Calendar className="h-5 w-5" />
                      <span>Start Date: January 2025</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Clock className="h-5 w-5" />
                      <span>Duration: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Award className="h-5 w-5" />
                      <span>Certificate Included</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <DollarSign className="h-5 w-5" />
                      <span>Flexible Payment Plans</span>
                    </div>
                  </div>

                  <Separator className="bg-white/20 my-6" />

                  <Button className="w-full bg-white text-foreground hover:bg-white/90" size="lg" asChild>
                    <Link href="/apply">Apply for This Course</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-8"
              >
                {/* About Course */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        About This Course
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {course.description}
                      </p>
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold">What you&apos;ll learn:</h4>
                        <ul className="space-y-2">
                          {course.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Course Highlights */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Course Highlights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <div className="text-2xl font-bold text-primary">{course.duration}</div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <div className="text-2xl font-bold text-primary">{course.students}+</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <div className="text-2xl font-bold text-primary">{course.rating}</div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                          <div className="text-2xl font-bold text-primary">95%</div>
                          <div className="text-sm text-muted-foreground">Placement</div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h4 className="font-semibold">Career Opportunities:</h4>
                        <div className="flex flex-wrap gap-2">
                          {["Software Developer", "Data Analyst", "Project Manager", "Consultant", "Entrepreneur"].map((career) => (
                            <Badge key={career} variant="secondary">
                              {career}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Course Curriculum
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {course.curriculum.map((sem, index) => (
                        <AccordionItem key={index} value={`semester-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${course.color} flex items-center justify-center text-white text-sm font-bold`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold">{sem.semester}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-11 space-y-2">
                              {sem.subjects.map((subject, subIndex) => (
                                <div
                                  key={subIndex}
                                  className="flex items-center gap-2 py-2 border-b border-border last:border-0"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-muted-foreground">{subject}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {course.features.map((feature, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4`}>
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{feature}</h3>
                        <p className="text-sm text-muted-foreground">
                          Master this essential skill through hands-on projects and expert instruction.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join {course.students}+ students who have already enrolled in {course.title}.
              Take the first step towards your dream career today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 px-8"
              >
                <Link href="/apply">
                  Apply Now
                  <GraduationCap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Link href="/courses">Explore Other Courses</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
