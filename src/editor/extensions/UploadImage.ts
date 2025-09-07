import Image from "@tiptap/extension-image";
import type { ImageOptions } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import UploadImageView from "@/editor/nodeviews/UploadImageView";
import { buildCloudinaryUrl, buildSrcSet } from "@/utils/cloudinary";
import { validateImageFile, createObjectUrl, revokeObjectUrl } from "@/utils/imageValidation";
import type { AssetInfo } from "@/types";
import { Plugin } from "prosemirror-state";
import { toast } from "sonner";
import { normalizeAxiosError } from "@/utils/responseHandlers";

export interface UploadImageOptions extends Partial<ImageOptions> {
  upload: (file: File, onProgress: (pct: number) => void) => Promise<AssetInfo>;
}

// Note: We intentionally avoid TypeScript command augmentation here to prevent
// conflicts with the built-in Image command typings. The runtime command
// `uploadImages` is still registered and invoked via `editor.commands`.

function genTempId() {
  return `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function findImagePosByTempId(editor: Editor, tempId: string) {
  let found: number | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "image" && node.attrs["data-temp-id"] === tempId) {
      found = pos;
      return false;
    }
    return true;
  });
  return found;
}

export const UploadImage = Image.extend<UploadImageOptions>({
  name: "image",

  addOptions() {
    return {
      ...this.parent?.(),
      upload: async () => {
        throw new Error("Upload function not provided");
      },
    } as UploadImageOptions;
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
      srcset: { default: null },
      sizes: { default: "(max-width: 768px) 100vw, 768px" },
      "data-public-id": { default: null },
      "data-uploading": { default: false },
      "data-progress": { default: 0 },
      "data-temp-id": { default: null },
      "data-origin-url": { default: null },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      uploadImages:
        (files: File[]) =>
        ({ editor }: { editor: Editor }) => {
          const valid = files.filter((f) => validateImageFile(f).ok);
          const invalid = files.filter((f) => !validateImageFile(f).ok);
          if (invalid.length > 0) {
            const first = invalid[0];
            const reason = validateImageFile(first);
            if (reason.ok === false) toast.error(reason.reason);
          }
          valid.forEach((file) => this.options && handleInsertAndUpload(editor, file, this.options.upload));
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;
    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const files = Array.from(event.clipboardData?.files || []).filter((f) => f.type.startsWith("image/"));
            if (files.length === 0) return false;
            event.preventDefault();
            type UploadCmds = { commands: { uploadImages: (files: File[]) => void } };
            (editor as unknown as UploadCmds).commands.uploadImages(files);
            return true;
          },
          handleDrop(_view, event) {
            const files = Array.from(event.dataTransfer?.files || []).filter((f) => f.type.startsWith("image/"));
            if (files.length === 0) return false;
            event.preventDefault();
            type UploadCmds = { commands: { uploadImages: (files: File[]) => void } };
            (editor as unknown as UploadCmds).commands.uploadImages(files);
            return true;
          },
        },
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(UploadImageView);
  },
});

async function handleInsertAndUpload(
  editor: Editor,
  file: File,
  upload: (file: File, onProgress: (pct: number) => void) => Promise<AssetInfo>
) {
  const tempId = genTempId();
  const blobUrl = createObjectUrl(file);

  // Insert placeholder node
  editor
    .chain()
    .focus()
    .insertContent({
      type: "image",
      attrs: {
        src: blobUrl,
        alt: file.name || "image",
        "data-uploading": true,
        "data-progress": 0,
        "data-temp-id": tempId,
      },
    })
    .run();

  const setProgress = (pct: number) => {
    const pos = findImagePosByTempId(editor, tempId);
    if (pos == null) return;
    const node = editor.state.doc.nodeAt(pos);
    if (!node) return;
    const attrs = { ...node.attrs, "data-progress": pct };
    editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, attrs));
  };

  try {
    const asset = await upload(file, (p) => setProgress(p));

    const pos = findImagePosByTempId(editor, tempId);
    if (pos == null) return;
    const node = editor.state.doc.nodeAt(pos);
    if (!node) return;

    const transformedSrc = buildCloudinaryUrl(asset.url, { w: 1200 });
    const srcset = buildSrcSet(asset.url);

    const newAttrs = {
      ...node.attrs,
      src: transformedSrc,
      srcset,
      sizes: "(max-width: 1200px) 100vw, 1200px",
      width: asset.width,
      height: asset.height,
      "data-public-id": asset.publicId,
      "data-origin-url": asset.url,
      "data-uploading": false,
      "data-progress": 100,
      "data-temp-id": null,
    };
    editor.view.dispatch(editor.state.tr.setNodeMarkup(pos, undefined, newAttrs));
  } catch (err: unknown) {
    const pos = findImagePosByTempId(editor, tempId);
    if (pos != null) {
      const nodeAtPos = editor.state.doc.nodeAt(pos);
      if (nodeAtPos) {
        const tr = editor.state.tr.delete(pos, pos + nodeAtPos.nodeSize);
        editor.view.dispatch(tr);
      }
    }
    try {
      import type { AxiosError } from "axios";
      const nerr = normalizeAxiosError(err as AxiosError);
      // Friendly mapping for common cases matching backend behavior
      if (nerr.status === 413) {
        toast.error("File too large. Max size is 5MB");
      } else if (
        (nerr.title && /MaxUploadSize|Payload Too Large/i.test(nerr.title)) ||
        (typeof nerr.detail === "string" && /MaxUploadSize|Payload Too Large/i.test(nerr.detail))
      ) {
        toast.error("File too large. Max size is 5MB");
      } else if (nerr.detail) {
        toast.error(nerr.detail);
      } else if (nerr.title) {
        toast.error(nerr.title);
      } else {
        toast.error("Image upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    }
  } finally {
    revokeObjectUrl(blobUrl);
  }
}
