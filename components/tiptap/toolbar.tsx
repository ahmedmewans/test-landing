"use client";

import { useEditorState } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  ListTodoIcon,
  type LucideIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  AlignButton,
  FontFamilyButton,
  FontSizeButton,
  HeadingLevelButton,
  HighlightColorButton,
  ImageButton,
  LineHeightButton,
  LinkButton,
  ListButton,
  TextColorButton,
} from "./helpers/helpers";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
        isActive && "bg-accent text-accent-foreground",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

export const Toolbar = ({ className }: { className?: string }) => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold"),
      isItalic: ctx.editor?.isActive("italic"),
      isUnderline: ctx.editor?.isActive("underline"),
      isTaskList: ctx.editor?.isActive("taskList"),
      isComment: ctx.editor?.isActive("liveblocksCommentMark"),
    }),
  });

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => {
          editor?.chain().focus().undo().run();
        },
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => {
          editor?.chain().focus().redo().run();
        },
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => {
          window.print();
        },
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        onClick: () => {
          const current = editor?.view.dom.getAttribute("spellcheck");
          editor?.view.dom.setAttribute(
            "spellcheck",
            current === "false" ? "true" : "false",
          );
        },
      },
    ],

    [
      {
        label: "Bold",
        icon: BoldIcon,
        onClick: () => {
          editor?.chain().focus().toggleBold().run();
        },
        isActive: editorState?.isBold,
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        onClick: () => {
          editor?.chain().focus().toggleItalic().run();
        },
        isActive: editorState?.isItalic,
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        onClick: () => {
          editor?.chain().focus().toggleUnderline().run();
        },
        isActive: editorState?.isUnderline,
      },
    ],

    [
      {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: editorState?.isTaskList,
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
      },
    ],
  ];

  return (
    <div
      className={cn(
        "flex items-center gap-x-0.5 overflow-x-auto p-2",
        className,
      )}
    >
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <div className="h-6 w-px bg-border mx-1" />

      <FontFamilyButton />

      <div className="h-6 w-px bg-border mx-1" />

      <HeadingLevelButton />

      <div className="h-6 w-px bg-border mx-1" />

      <FontSizeButton />

      <div className="h-6 w-px bg-border mx-1" />

      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}

      <TextColorButton />
      <HighlightColorButton />

      <div className="h-6 w-px bg-border mx-1" />

      <LinkButton />
      <ImageButton />
      <AlignButton />
      <LineHeightButton />
      <ListButton />

      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};
