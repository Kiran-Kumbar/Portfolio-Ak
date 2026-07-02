"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const codeSnippet = `// [sys] initializing neural-mesh architecture v9.4.2...
import { CoreKernel, V8Engine } from '@sys/node';
import { WebGLShaders, VectorMath } from '@gpu/three';
import { StateMachine } from '@kiran/brain';

const developerNode = new CoreKernel({
  uuid: 'KIRAN_KUMBAR',
  role: 'FULL_STACK_ARCHITECT',
  memory: 'DDR5_UNLIMITED',
  threads: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript']
});

async function mountGodLevelUI() {
  const renderPipeline = new WebGLShaders({
    antiAliasing: true,
    fps: 144,
    physicsEngine: 'Framer Motion'
  });

  await developerNode.compile(renderPipeline);
  
  if (developerNode.status === 'READY') {
    developerNode.bypassSecurityProtocols();
    return renderPipeline.execute();
  }
}

mountGodLevelUI();

`;

export default function GlassTerminal() {
  const [displayedText, setDisplayedText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let globalIndex = 0;
    const typingInterval = setInterval(() => {
      // Loop through the code snippet infinitely
      const char = codeSnippet[globalIndex % codeSnippet.length];
      
      setDisplayedText((prev) => {
        let nextText = prev + char;
        // Keep the string length manageable to prevent memory issues
        // Slice off the top lines if it gets too long
        if (nextText.length > 800) {
          const firstNewline = nextText.indexOf('\n');
          if (firstNewline !== -1) {
            nextText = nextText.substring(firstNewline + 1);
          }
        }
        return nextText;
      });
      
      globalIndex++;
    }, 20); // Extremely fast hacker typing speed

    return () => clearInterval(typingInterval);
  }, []);

  // Auto-scroll to bottom as new lines appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  // Minimalist Hacker Highlighting for Light Background
  const highlightCode = (code: string) => {
    return code
      .replace(/\/\/ \[sys\] initializing neural-mesh architecture v9\.4\.2\.\.\./g, (match) => `<span class="text-muted/70 italic">${match}</span>`)
      .replace(/import|from|const|new|async|await|return|if/g, (match) => `<span class="text-accent font-bold">${match}</span>`)
      .replace(/CoreKernel|V8Engine|WebGLShaders|VectorMath|StateMachine/g, (match) => `<span class="text-foreground font-bold">${match}</span>`)
      .replace(/true|144/g, (match) => `<span class="text-danger font-bold">${match}</span>`) // numbers/booleans
      .replace(/'[^']*'/g, (match) => `<span class="text-success font-semibold">${match}</span>`); // strings
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="w-full max-w-xl lg:max-w-none ml-auto"
    >
      {/* Floating Container Grounded by an invisible Editor Margin */}
      <motion.div 
        whileHover={{ rotateY: -1, rotateX: 1, x: 5 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative bg-surface/70 backdrop-blur-xl border-l border-accent/15 pl-6 md:pl-8 rounded-r-lg"
      >
        {/* Pure Code Content with Auto-Scroll */}
        <div 
          ref={scrollRef}
          className="py-6 pr-2 overflow-hidden h-[350px] md:h-[550px]"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
        >
          <pre className="font-mono text-[16px] md:text-[18px] leading-[1.8] text-slate-300 whitespace-pre-wrap break-words">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(displayedText) }} />
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-emerald-600 ml-1 align-middle"
            />
          </pre>
        </div>
      </motion.div>
    </motion.div>
  );
}
