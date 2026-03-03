"use client";

import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { Color, FontFamily, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import { useEditorStore } from "@/store/use-editor-store";
import { FontSize } from "./extensions/font-size";
import { LineHeight } from "./extensions/line-height";
import { Toolbar } from "./toolbar";

interface Props {
  /** HTML content to load when editor initializes */
  initialContent?: string;
  /** Callback fired on every content change, returns HTML string */
  onChange?: (html: string) => void;
}

/**
 * Rich-text editor powered by Tiptap.
 * Provides full WYSIWYG editing with support for formatting, images, tables, and more.
 */
export const Editor = ({ initialContent, onChange }: Props) => {
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    onCreate: ({ editor }) => {
      setEditor(editor);
    },
    onDestroy: () => {
      setEditor(null);
    },
    onUpdate: ({ editor }) => {
      setEditor(editor);
      // Notify parent of content changes
      onChange?.(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      setEditor(editor);
    },
    onTransaction: ({ editor }) => {
      setEditor(editor);
    },
    onFocus: ({ editor }) => {
      setEditor(editor);
    },
    onBlur: ({ editor }) => {
      setEditor(editor);
    },
    onContentError: ({ editor }) => {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert mx-auto focus:outline-none print:border-0 flex flex-col min-h-[400px] w-full pt-6 px-6 pb-6 cursor-text",
      },
    },
    extensions: [
      StarterKit,
      Underline,
      Color,
      FontFamily,
      LineHeight.configure({
        types: ["heading", "paragraph"],
      }),
      FontSize,
      TextStyle,
      TaskList,
      Image,
      ImageResize,
      TaskItem.configure({
        nested: true,
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent ?? "",
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col rounded-md border border-input bg-background shadow-sm">
      <Toolbar className="border-b border-input bg-muted/20" />
      <div className="size-full overflow-x-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
