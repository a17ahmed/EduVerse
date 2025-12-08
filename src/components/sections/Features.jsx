"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, Handshake, Clock, Briefcase, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Expert Faculty",
    description: "Learn from industry professionals and experienced academics who bring real-world insights to the classroom.",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-500"
  },
  {
    title: "Modern Facilities",
    description: "State-of-the-art labs, libraries, and collaborative spaces designed to enhance your learning experience.",
    icon: Building2,
    color: "from-cyan-500 to-blue-500"
  },
  {
    title: "Industry Partnerships",
    description: "Strong connections with leading companies ensure relevant curriculum and excellent placement opportunities.",
    icon: Handshake,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Flexible Learning",
    description: "Choose from full-time, part-time, or online options to fit your schedule and learning style.",
    icon: Clock,
    color: "from-orange-500 to-amber-500"
  },
  {
    title: "Career Support",
    description: "Dedicated career services team to help with internships, job placements, and professional development.",
    icon: Briefcase,
    color: "from-pink-500 to-rose-500"
  },
  {
    title: "Global Community",
    description: "Join a diverse community of students from around the world and build lifelong connections.",
    icon: Globe,
    color: "from-indigo-500 to-violet-500"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Features() {
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We provide comprehensive support and resources to help you achieve your
            academic and career goals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="group h-full bg-card hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex flex-col h-full">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
