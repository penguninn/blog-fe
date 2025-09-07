import React from "react";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { cn } from "@/lib/utils";

const ProgressOverlay = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-xs rounded-sm">
      <div className="w-3/4 h-2 bg-white/30 rounded overflow-hidden">
        <div
          className="h-full bg-white/90 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="mt-2">{Math.round(progress)}%</div>
    </div>
  );
};

export default function UploadImageView({ node, selected, HTMLAttributes }: NodeViewProps) {
  const { attrs } = node;
  const uploading = Boolean(attrs["data-uploading"]);
  const progress = Number(attrs["data-progress"]) || 0;
  const src = attrs.src as string;
  const alt = (attrs.alt as string) || "image";
  const title = (attrs.title as string) || undefined;
  const srcSet = (attrs.srcset as string) || undefined;
  const sizes = (attrs.sizes as string) || undefined;

  // Extract class from HTMLAttributes without passing invalid DOM props like `srcset`
  const htmlClass = (HTMLAttributes as any)?.class || (HTMLAttributes as any)?.className;

  return (
    <NodeViewWrapper
      as="span"
      className={cn(
        "relative inline-block align-middle max-w-full",
        selected && "ring-2 ring-ring/50"
      )}
    >
      <img
        src={src}
        alt={alt}
        title={title}
        loading="lazy"
        decoding="async"
        srcSet={srcSet}
        sizes={sizes}
        data-public-id={attrs["data-public-id"] as any}
        data-origin-url={attrs["data-origin-url"] as any}
        data-uploading={uploading ? "true" : undefined}
        data-progress={uploading ? String(progress) : undefined}
        data-temp-id={attrs["data-temp-id"] as any}
        className={cn("max-w-full h-auto rounded-sm", htmlClass, uploading && "opacity-80")}
        draggable
        data-drag-handle
      />
      {uploading && <ProgressOverlay progress={progress} />}
    </NodeViewWrapper>
  );
}
