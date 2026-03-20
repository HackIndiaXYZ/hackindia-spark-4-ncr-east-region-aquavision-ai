import { CloudUpload } from "lucide-react";
import { useState } from "react";

interface UploadZoneProps {
  onUpload: () => void;
}

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex h-full w-full items-center justify-center p-4 md:p-8">
      <div
        className={`flex w-full max-w-lg flex-col items-center gap-6 rounded-xl border-2 border-dashed p-8 transition-all md:gap-8 md:p-12 ${
          isDragging
            ? "border-[#4f46e5] bg-indigo-50"
            : "border-indigo-200 bg-white hover:border-[#4f46e5] hover:bg-indigo-50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onUpload();
        }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 md:h-20 md:w-20">
          <CloudUpload className="h-8 w-8 text-[#4f46e5] md:h-12 md:w-12" />
        </div>

        <div className="text-center">
          <h3 className="mb-2 text-lg md:text-xl" style={{ fontWeight: 700 }}>
            Drop your contract here
          </h3>
          <p className="text-muted-foreground">
            Supports PDF, DOCX, up to 50MB
          </p>
        </div>

        <button
          onClick={onUpload}
          className="rounded-lg border border-border bg-white px-6 py-2.5 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ fontWeight: 500 }}
        >
          Browse Files
        </button>
      </div>
    </div>
  );
}
