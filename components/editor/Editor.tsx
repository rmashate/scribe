"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, placeholder = "Start writing..." }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap prose max-w-none focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="border border-border rounded-lg p-4 min-h-[300px] animate-pulse bg-muted" />
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-border p-2 flex items-center gap-1 flex-wrap bg-muted/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("bold") ? "bg-muted" : ""
          }`}
          title="Bold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("italic") ? "bg-muted" : ""
          }`}
          title="Italic"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
          </svg>
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
          }`}
          title="Heading 2"
        >
          <span className="text-sm font-bold">H2</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
          }`}
          title="Heading 3"
        >
          <span className="text-sm font-bold">H3</span>
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("bulletList") ? "bg-muted" : ""
          }`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("orderedList") ? "bg-muted" : ""
          }`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
          </svg>
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("blockquote") ? "bg-muted" : ""
          }`}
          title="Quote"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("codeBlock") ? "bg-muted" : ""
          }`}
          title="Code Block"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>
      {/* Editor Content */}
      <EditorContent editor={editor} className="p-4 min-h-[300px]" />
    </div>
  );
}
