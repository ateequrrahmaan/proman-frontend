"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard, 
  Users, 
  Zap,
  BarChart3,
  Shield,
  Sun,
  Moon,
  Sparkles,
  Star,
  Rocket,
  TrendingUp,
  Globe,
  Cpu,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const { token } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            PM
          </div>
          <span className="text-xl font-bold tracking-tight">ProMan</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {token ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 overflow-hidden">
          {/* Advanced Animated Background */}
          <motion.div 
            className="absolute inset-0 -z-10"
            style={{ y: backgroundY }}
          >
            {/* Base gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            
            {/* Animated mesh gradient */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Floating geometric shapes */}
            {[...Array(15)].map((_, i) => {
              const shapes = ['rounded-full', 'rounded-lg', 'rotate-45'];
              const colors = ['bg-primary/20', 'bg-blue-500/20', 'bg-purple-500/20', 'bg-pink-500/20'];
              const size = Math.random() * 60 + 20;
              
              return (
                <motion.div
                  key={i}
                  className={`absolute ${shapes[i % 3]} ${colors[i % 4]}`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -Math.random() * 100 - 50, 0],
                    x: [0, Math.random() * 100 - 50, 0],
                    rotate: [0, Math.random() * 360, 0],
                    scale: [1, Math.random() * 0.5 + 0.8, 1],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
            
            {/* Animated background waves */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                  <stop offset="50%" stopColor="rgba(147, 51, 234, 0.3)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
                </linearGradient>
                <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(236, 72, 153, 0.2)" />
                  <stop offset="50%" stopColor="rgba(34, 197, 94, 0.2)" />
                  <stop offset="100%" stopColor="rgba(236, 72, 153, 0.2)" />
                </linearGradient>
              </defs>
              
              <motion.path
                d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,300 L0,300 Z"
                fill="url(#wave1)"
                animate={{
                  d: [
                    "M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,300 L0,300 Z",
                    "M0,120 C150,70 350,170 500,120 C650,70 850,170 1000,120 L1000,300 L0,300 Z",
                    "M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,300 L0,300 Z"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.path
                d="M0,150 C200,100 300,200 500,150 C700,100 800,200 1000,150 L1000,300 L0,300 Z"
                fill="url(#wave2)"
                animate={{
                  d: [
                    "M0,150 C200,100 300,200 500,150 C700,100 800,200 1000,150 L1000,300 L0,300 Z",
                    "M0,130 C200,180 300,80 500,130 C700,180 800,80 1000,130 L1000,300 L0,300 Z",
                    "M0,150 C200,100 300,200 500,150 C700,100 800,200 1000,150 L1000,300 L0,300 Z"
                  ]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </svg>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" 
                 style={{
                   backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                   backgroundSize: '50px 50px'
                 }}
            />
          </motion.div>

          {/* Mouse follower effect */}
          <motion.div
            className="pointer-events-none fixed inset-0 z-50"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
            }}
          />

          <motion.div 
            className="max-w-5xl mx-auto text-center space-y-8"
            style={{ y: textY, opacity }}
          >
            <motion.div className="relative inline-block">
              {/* Advanced glow effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-75"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                  filter: [
                    "blur(20px)",
                    "blur(30px)", 
                    "blur(20px)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Secondary glow layer */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-xl blur-xl opacity-50"
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Pulsing glow dots */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${-10 + (i % 2) * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.7)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                      "0 0 0 0 rgba(59, 130, 246, 0.7)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative text-5xl md:text-7xl font-extrabold tracking-tighter"
                style={{
                  textShadow: `
                    0 0 20px rgba(59, 130, 246, 0.3),
                    0 0 40px rgba(59, 130, 246, 0.2),
                    0 4px 6px rgba(0, 0, 0, 0.1)
                  `,
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.2))'
                }}
              >
                <span className="block text-foreground font-bold">Transform Your</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600 animate-gradient bg-300%"
                      style={{
                        filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))'
                      }}>
                  Digital Workflow
                </span>
              </motion.h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              The all-in-one project management platform for modern teams. 
              Track tasks, collaborate with members, and hit your deadlines with ease.
            </motion.p>
            
            <motion.div 
              className="flex items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotateY: 10 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 0.01}deg) rotateX(${-y * 0.01}deg) scale(1.05)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
                }}
              >
                <Button size="lg" className="h-14 px-10 text-base relative overflow-hidden group shadow-2xl" asChild>
                  <Link href="/register">
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-purple-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, rotateY: -10 }} 
                whileTap={{ scale: 0.95 }}
                className="relative"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 0.01}deg) rotateX(${-y * 0.01}deg) scale(1.05)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
                }}
              >
                <Button size="lg" variant="outline" className="h-14 px-10 text-base border-2 border-primary/20 hover:border-primary/40 backdrop-blur-sm shadow-xl" asChild>
                  <Link href="/login">
                    <Globe className="mr-2 h-5 w-5" />
                    Live Demo
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Advanced Trust indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-10 pt-12"
            >
              {[
                { icon: Star, label: "4.9/5 Rating", sublabel: "2,500+ Reviews" },
                { icon: Users, label: "10K+ Teams", sublabel: "Global" },
                { icon: TrendingUp, label: "99.9% Uptime", sublabel: "SLA Guaranteed" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-2 text-center group"
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <motion.div 
                    className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div>
                    <span className="block font-semibold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          
          <div className="max-w-6xl mx-auto relative">
             <motion.div 
               className="text-center mb-16 space-y-4"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               viewport={{ once: true }}
             >
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
                  whileHover={{ scale: 1.02 }}
                >
                  Everything you need to ship faster
                </motion.h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                  Built for precision and speed. Our tools help you stay focused on the work that matters.
                </p>
             </motion.div>
             
             <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Advanced Kanban",
                    description: "Visualize your workflow with a powerful, drag-and-drop Kanban board.",
                    icon: LayoutDashboard,
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Team Collaboration",
                    description: "Invite your colleagues and assign tasks with distinct roles and permissions.",
                    icon: Users,
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "Real-time Metrics",
                    description: "Track your progress with beautiful dashboards and data visualizations.",
                    icon: BarChart3,
                    gradient: "from-emerald-500 to-teal-500",
                  },
                  {
                    title: "Security First",
                    description: "Enterprise-grade security with JWT authentication and RBAC.",
                    icon: Shield,
                    gradient: "from-orange-500 to-red-500",
                  },
                  {
                    title: "Lightning Speed",
                    description: "Optimized for performance with Next.js 14 and TanStack Query.",
                    icon: Zap,
                    gradient: "from-yellow-500 to-orange-500",
                  },
                  {
                    title: "Smart Invites",
                    description: "Onboard your entire team in seconds with secure invite tokens.",
                    icon: CheckCircle2,
                    gradient: "from-indigo-500 to-purple-500",
                  },
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: -10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -10,
                      rotateX: 5,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative"
                  >
                    {/* 3D Card container */}
                    <div className="relative h-full p-8 rounded-3xl border bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform-gpu">
                      {/* Gradient border effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                           style={{
                             backgroundImage: `linear-gradient(135deg, ${feature.gradient.split(' ').join(', ')})`,
                             padding: '2px',
                           }}>
                        <div className="absolute inset-2 rounded-3xl bg-card" />
                      </div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <motion.div 
                          className="h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg"
                          style={{ backgroundImage: `linear-gradient(135deg, ${feature.gradient.split(' ').join(', ')})` }}
                          whileHover={{ 
                            rotate: 360,
                            scale: 1.1,
                            transition: { duration: 0.5 }
                          }}
                        >
                          <feature.icon className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                        
                        {/* Hover arrow */}
                        <motion.div 
                          className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <span className="text-sm font-medium">Learn more</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </div>
                      
                      {/* Floating particles */}
                      {[...Array(3)].map((_, j) => (
                        <motion.div
                          key={j}
                          className="absolute w-2 h-2 bg-primary/20 rounded-full"
                          style={{
                            left: `${20 + j * 30}%`,
                            top: `${10 + j * 15}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2 + j * 0.5,
                            repeat: Infinity,
                            delay: j * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-600 opacity-10" />
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div 
            className="max-w-3xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="p-12 rounded-3xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground space-y-8 relative overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Floating elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-white/10 rounded-full"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 2) * 30}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-3xl md:text-5xl font-bold italic tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Ready to transform your
                  <span className="block text-yellow-300">workflow?</span>
                </motion.h2>
                
                <motion.p 
                  className="text-primary-foreground/90 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Join thousands of teams who trust ProMan to deliver excellence every single day.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="pt-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="h-14 px-10 text-base font-semibold bg-white text-primary hover:bg-gray-100 shadow-lg"
                      asChild
                    >
                      <Link href="/register">
                        <Rocket className="mr-2 h-5 w-5" />
                        Get Started Now
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <motion.div 
                className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                PM
              </motion.div>
              <span className="font-bold">ProMan</span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="flex gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { label: "Twitter", href: "#" },
              { label: "LinkedIn", href: "#" },
              { label: "Github", href: "#" },
              { label: "Privacy", href: "#" },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link 
                  href={item.href} 
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            © 2026 ProMan Inc. All rights reserved.
          </motion.p>
        </motion.div>
      </footer>
    </div>
  );
}
