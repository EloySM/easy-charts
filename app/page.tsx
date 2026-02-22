"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [selectedImg, setSelectedImg] = useState<{src: string, alt: string, id: string} | null>(null);

  const features = [
    { src: "/first.png", title: "Quick Entry", desc: "Log expenses in under 2 seconds.", alt: "Fast expense entry", id: "feat-0" },
    { src: "/second.png", title: "Clear Analytics", desc: "Visualize where your money goes with charts.", alt: "Visual finance analysis", id: "feat-1" },
    { src: "/third.png", title: "Total Privacy", desc: "Your data is yours. Encrypted and secured.", alt: "Data security and privacy", id: "feat-2" }
  ];

  const smoothTransition = {
    type: "spring",
    stiffness: 200,
    damping: 25,
    mass: 0.5
  } as const;

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      {/* 1. NAVEGACIÓN */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-zinc-100">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/spency.svg" alt="Spency Logo" width={32} height={32} priority className="invert" />
          <span className="text-xl font-bold tracking-tighter uppercase">Spency</span>
        </Link>
        <nav className="flex gap-6 items-center text-sm font-medium">
          <Link href="/login" className="hover:text-zinc-500 transition-colors">Login</Link>
          <Link href="/signup">
            <Button size="sm" className="rounded-full px-6">Get started free</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* 2. SECCIÓN HERO */}
        <section className="py-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Your finances, <br />
              <span className="text-zinc-400">no noise.</span>
            </h1>
            <p className="text-lg text-zinc-500 mb-8">
              Designed for clarity. Control every cent with an interface that breathes.
            </p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-sm">
                Create account now
              </Button>
            </Link>
          </div>
          
          {/* IMAGEN HERO MODIFICADA: Efecto Zoom */}
          <div className="w-full">
            <motion.div 
              layoutId="img-hero"
              transition={smoothTransition}
              onClick={() => setSelectedImg({src: "/more.png", alt: "Dashboard Preview", id: "img-hero"})}
              // Añadida la clase 'group' para controlar el hover de la imagen interna
              // Quitados el padding y el bg-zinc-50 del contenedor
              className="relative aspect-video w-full overflow-hidden cursor-zoom-in rounded-2xl border border-zinc-200 shadow-2xl group"
            >
               <Image 
                src="/more.png" 
                alt="Dashboard" 
                fill 
                // CAMBIO CLAVE: object-cover en lugar de object-contain.
                // Eliminado el padding (p-4).
                // Añadido el efecto de escala al hacer hover en el grupo.
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                priority 
              />
            </motion.div>
          </div>
        </section>

        {/* 3. SECCIÓN CARACTERÍSTICAS */}
        <section className="py-24 bg-zinc-50 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-2">Why Spency?</h2>
              <p className="text-zinc-500 text-sm">Minimalism meets financial control.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.id} className="space-y-4">
                  <motion.div 
                    layoutId={feature.id}
                    transition={smoothTransition}
                    onClick={() => setSelectedImg({src: feature.src, alt: feature.alt, id: feature.id})}
                    className="relative w-full aspect-video rounded-xl overflow-hidden cursor-zoom-in border border-zinc-200 bg-white shadow-sm group"
                  >
                     {/* También aplicamos un ligero zoom hover a las pequeñas para consistencia */}
                     <Image 
                      src={feature.src} 
                      alt={feature.alt} 
                      fill 
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110" 
                     />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-base">{feature.title}</h3>
                    <p className="text-zinc-500 text-xs">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SECCIÓN FINAL CTA */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <div className="bg-zinc-900 text-white rounded-[2.5rem] p-16 overflow-hidden relative min-h-[400px] flex flex-col justify-center items-center shadow-2xl">
            <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to take control?</h2>
            <p className="text-zinc-400 mb-10 relative z-10 max-w-sm text-base">
              Join those who have already simplified their financial life.
            </p>
            <Link href="/signup" className="relative z-10">
              <Button variant="secondary" size="lg" className="rounded-full px-12 h-14 font-semibold">
                Start today
              </Button>
            </Link>
            
            <div className="absolute inset-0 opacity-15">
                <Image src="/more.png" alt="" fill className="object-cover scale-110 grayscale" />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-100 px-6 text-center text-zinc-400 text-[10px] uppercase tracking-[0.2em]">
        <p>&copy; {new Date().getFullYear()} Spency App. Made for simplicity.</p>
      </footer>

      {/* MODAL DE VISTA TRANSITION */}
      <AnimatePresence>
        {selectedImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-16">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="absolute inset-0 bg-white/95 backdrop-blur-xl"
            />
            <motion.div 
              layoutId={selectedImg.id}
              transition={smoothTransition}
              className="relative w-full max-w-6xl aspect-video bg-white shadow-2xl rounded-3xl overflow-hidden border border-zinc-200"
            >
              {/* En el modal siempre usamos object-contain para ver la imagen completa */}
              <Image src={selectedImg.src} alt={selectedImg.alt} fill className="object-contain p-2 md:p-6" />
              <button 
                onClick={() => setSelectedImg(null)}
                className="absolute top-6 right-6 bg-zinc-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20"
              >✕</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}