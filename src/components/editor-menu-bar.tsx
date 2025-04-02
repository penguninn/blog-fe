import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "./ui/button";
import { ImParagraphLeft, ImParagraphRight, ImParagraphCenter, ImParagraphJustify } from "react-icons/im";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";


interface TiptapMenuBarProps {
  editor: Editor | null;
}

const EditorMenuBar: React.FC<TiptapMenuBarProps> = ({ editor }) => {

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Heading levels */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        h1
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        h2
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        h3
      </Button>

      {/* Bold */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        B
      </Button>

      {/* Italic */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        I
      </Button>

      {/* Underline */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        U
      </Button>

      {/* Strike */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        S
      </Button>

      {/* Alignment */}
      <Button 
        type="button" 
        onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <ImParagraphLeft />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <ImParagraphCenter />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <ImParagraphRight />
      </Button>
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <ImParagraphJustify />
      </Button>

      {/* Bullet list */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        <AiOutlineUnorderedList />
      </Button>

      {/* Ordered list */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        <AiOutlineOrderedList />
      </Button>

      {/* Code block */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        Code
      </Button>

      {/* Blockquote */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-gray-500 hover:bg-gray-500" : ""}
      >
        "Quote"
      </Button>

      {/* Image */}
      <Button type="button" onClick={addImage}>Image</Button>

      {/* Clear formatting */}
      <Button
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
