"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { DownloadIcon, PrinterIcon, ArrowLeftIcon } from "lucide-react";

export default function ResumePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-[#0B0B0B] text-[#FAF9F6] font-sans">
      {/* Top Action Bar */}
      <header className="flex-none h-16 px-4 md:px-8 border-b border-white/10 flex items-center justify-between bg-[#111]">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium hover:text-[#C8B89A] transition-colors"
        >
          <ArrowLeftIcon size={16} />
          <span>Back to Portfolio</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Print Button */}
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium hidden sm:flex"
            title="Print Resume"
          >
            <PrinterIcon size={16} />
            <span>Print</span>
          </button>

          {/* Download Button */}
          <a 
            href="/Kiran_Kumbar_Resume1.pdf" 
            download="Kiran_Kumbar_Resume1.pdf"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8B89A] text-black hover:bg-[#b0a083] transition-colors text-sm font-semibold shadow-lg"
          >
            <DownloadIcon size={16} />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 w-full bg-[#1A1A1A] relative">
        <iframe 
          ref={iframeRef}
          id="pdf-iframe"
          src="/Kiran_Kumbar_Resume1.pdf" 
          className="absolute inset-0 w-full h-full border-none"
          title="Resume PDF"
        />
      </main>
      
      {/* Mobile Print Helper (since iframe print can be tricky on iOS, provide a direct link for mobile) */}
      <div className="sm:hidden flex-none p-4 bg-[#111] border-t border-white/10 flex justify-center text-xs text-white/50">
        Note: To print on mobile, download the PDF first.
      </div>
    </div>
  );
}
