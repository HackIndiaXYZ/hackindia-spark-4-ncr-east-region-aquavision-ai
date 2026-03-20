import { CloudUpload } from "lucide-react";
import { useRef, useState } from "react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];

    if (!file) {
      return;
    }

    onUpload(file);
  };

  const handleDemoClick = () => {
    // Creating a dummy file that isn't a real PDF will intentionally fail
    // the pdf-parse library on the backend, cleanly triggering the demo fallback.
    const demoFile = new File(
      ["dummy content"],
      "Acme_Corp_Service_Agreement.pdf",
      { type: "application/pdf" }
    );
    onUpload(demoFile);
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div
        className={`flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl border-2 border-dashed p-8 transition-all md:gap-8 md:p-12 bg-white dark:bg-[#15192C] shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${
        isDragging
          ? "border-indigo-500 bg-indigo-50 dark:border-violet-500 dark:bg-violet-500/10"
          : "border-border dark:border-white/10 hover:border-indigo-400 dark:hover:border-violet-500/50 hover:bg-gray-50/50 dark:hover:bg-[#1A1F36]"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-violet-600/20 shadow-none dark:shadow-[0_0_30px_rgba(124,58,237,0.3)] md:h-20 md:w-20">
          <CloudUpload className="h-8 w-8 text-indigo-600 dark:text-violet-400 md:h-10 md:w-10" />
        </div>

        <div className="text-center">
          <h3 className="mb-2 text-lg md:text-xl text-foreground dark:text-slate-100" style={{ fontWeight: 700 }}>
            Upload Your Contract
          </h3>
          <p className="text-muted-foreground dark:text-slate-400">
            Upload a text-based PDF contract for the best results
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-white/5 bg-[#1F253F] px-6 py-2.5 text-[14px] text-slate-200 transition-colors hover:bg-[#2A3152] focus:outline-none focus:ring-2 focus:ring-violet-500"
            style={{ fontWeight: 500 }}
          >
            Upload Your Contract
          </button>
          
          <button
            onClick={handleDemoClick}
            className="rounded-lg border border-violet-500/30 bg-[#161A30] px-6 py-2.5 text-[14px] text-indigo-300 transition-all hover:bg-violet-500/20 hover:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
            style={{ fontWeight: 500 }}
          >
            Try with Sample Contract
          </button>
        </div>
      </div>
    </div>
  );
}
