import React, { useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "./ui/button";
import {
  ImParagraphLeft,
  ImParagraphRight,
  ImParagraphCenter,
  ImParagraphJustify,
} from "react-icons/im";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";

interface TiptapMenuBarProps {
  editor: Editor | null;
}

const EditorMenuBar: React.FC<TiptapMenuBarProps> = ({ editor }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFilesPicked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!editor || files.length === 0) return;
      type UploadCmds = { commands: { uploadImages: (files: File[]) => void } };
      (editor as unknown as UploadCmds).commands.uploadImages(files);
      // reset input value to allow selecting same file again
      e.target.value = "";
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        h1
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        h2
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        h3
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "bg-stone-300 dark:bg-neutral-600" : ""
        }
      >
        B
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "bg-stone-300 dark:bg-neutral-600" : ""
        }
      >
        I
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline") ? "bg-stone-300 dark:bg-neutral-600" : ""
        }
      >
        U
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "bg-stone-300 dark:bg-neutral-600" : ""
        }
      >
        S
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        <ImParagraphLeft />
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        <ImParagraphCenter />
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        <ImParagraphRight />
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={
          editor.isActive({ textAlign: "justify" })
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        <ImParagraphJustify />
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        <AiOutlineUnorderedList />
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        <AiOutlineOrderedList />
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          editor.isActive("codeBlock") ? "bg-stone-300 dark:bg-neutral-600" : ""
        }
      >
        Code
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "bg-stone-300 dark:bg-neutral-600"
            : ""
        }
      >
        "Quote"
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFilesPicked}
      />
      <Button variant="outline" type="button" onClick={openFilePicker}>
        Image
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
      >
        Clear
      </Button>
    </div>
  );
};
export default EditorMenuBar;
