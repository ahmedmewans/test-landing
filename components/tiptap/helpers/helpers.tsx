import type { Level } from "@tiptap/extension-heading";
import { useEditorState } from "@tiptap/react";
import {
  ALargeSmallIcon,
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronDownIcon,
  ImageIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { useState } from "react";
import { CirclePicker, type ColorResult, SketchPicker } from "react-color";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      currentFont: ctx.editor?.getAttributes("textStyle").fontFamily,
    }),
  });

  const fonts = [
    { label: "Inter", value: "Inter" },
    { label: "Comic Sans MS, Comic Sans", value: "Comic Sans MS, Comic Sans" },
    { label: "Serif", value: "Serif" },
    { label: "Monospace", value: "Monospace" },
    { label: "Cursive", value: "Cursive" },
    { label: "Var(--title-font-family)", value: "var(--title-font-family)" },
    { label: "Exo 2", value: "Exo 2" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-accent px-1.5 overflow-hidden text-sm"
        >
          <span className="truncate">
            {editorState?.currentFont || "Inter"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            className={cn(
              "flex text-sm h-7 p-1.5 cursor-pointer hover:bg-accent rounded-sm",
              editorState?.currentFont === font.value && "bg-accent",
            )}
            style={{ fontFamily: font.value }}
            onClick={() =>
              editor?.chain().focus().setFontFamily(font.value).run()
            }
          >
            {font.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      currentHeadingLevel: ctx.editor?.getAttributes("heading").level,
    }),
  });

  const headings = [
    { label: "Normal", value: 0, fontSize: "16px" },
    { label: "H1", value: 1, fontSize: "32px" },
    { label: "H2", value: 2, fontSize: "24px" },
    { label: "H3", value: 3, fontSize: "20px" },
    { label: "H4", value: 4, fontSize: "18px" },
    { label: "H5", value: 5, fontSize: "16px" },
    { label: "H6", value: 6, fontSize: "14px" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-accent px-1.5 overflow-hidden text-sm"
        >
          <span className="truncate">
            {headings.find((h) => h.value === editorState?.currentHeadingLevel)
              ?.label || "Normal"}
          </span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {headings.map(({ label, value, fontSize }) => (
          <DropdownMenuItem
            key={value}
            className={cn(
              "flex text-sm h-7 p-1.5 cursor-pointer hover:bg-accent rounded-sm",
              (value === 0 && !editorState?.currentHeadingLevel) ||
                editorState?.currentHeadingLevel === value
                ? "bg-accent"
                : "",
            )}
            style={{ fontSize }}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run();
              }
            }}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const TextColorButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      currentTextColor: ctx.editor?.getAttributes("textStyle").color,
    }),
  });

  const currentColor = editorState?.currentTextColor || "#000000";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5"
        >
          <span className="text-xs">A</span>
          <div
            className="h-0.5 w-full"
            style={{ backgroundColor: currentColor }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <SketchPicker
          color={currentColor}
          onChange={onChange}
          disableAlpha={false}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      currentHighlightColor: ctx.editor?.getAttributes("highlight").color,
    }),
  });

  const currentColor = editorState?.currentHighlightColor || "#ffffff";

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5"
        >
          <span
            style={{ backgroundColor: currentColor }}
            className="text-xs px-0.5"
          >
            H
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <CirclePicker color={currentColor} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState(editor?.getAttributes("link").href || "");

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor?.isActive("link"),
    }),
  });

  const onChange = (href: string) => {
    if (editor?.isActive("link")) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    } else {
      editor?.chain().focus().setLink({ href }).run();
    }
    setValue("");
  };

  const onRemove = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5",
            editorState?.isLink && "bg-accent",
          )}
        >
          <Link2Icon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
        {editorState?.isLink && (
          <Button onClick={onRemove}>
            <TrashIcon className="size-4" />
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ImageButton = () => {
  const { editor } = useEditorStore();
  const [imageUrl, setImageUrl] = useState("");

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };
    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5"
        >
          <ImageIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <div className="flex items-center gap-x-2">
          <Input
            placeholder="https://example.com"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <Button onClick={handleImageUrlSubmit}>Apply</Button>
        </div>
        <Button className="w-full mt-2" onClick={onUpload}>
          <UploadIcon className="size-4 mr-2" />
          Upload
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AlignButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      textAlign: ctx.editor?.getAttributes("textAlign").value,
    }),
  });

  const alignments = [
    {
      label: "Align Left",
      value: "left",
      icon: AlignLeftIcon,
    },
    {
      label: "Align Center",
      value: "center",
      icon: AlignCenterIcon,
    },
    {
      label: "Align Right",
      value: "right",
      icon: AlignRightIcon,
    },
    {
      label: "Align Justify",
      value: "justify",
      icon: AlignJustifyIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5"
        >
          <AlignLeftIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        {alignments.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "flex items-center gap-x-2",
              editorState?.textAlign === value && "bg-accent",
            )}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ListButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isList: ctx.editor?.isActive("bulletList"),
      isOrderList: ctx.editor?.isActive("orderedList"),
    }),
  });

  const lists = [
    {
      label: "Bullet List",
      icon: ListIcon,
      isActive: editorState?.isList,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      icon: ListOrderedIcon,
      isActive: editorState?.isOrderList,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5"
        >
          <ListIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        {lists.map(({ label, icon: Icon, isActive, onClick }) => (
          <DropdownMenuItem
            key={label}
            onClick={() => onClick()}
            className={cn("flex items-center gap-x-2", isActive && "bg-accent")}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      fontSize: ctx.editor?.getAttributes("textStyle").fontSize
        ? ctx.editor?.getAttributes("textStyle").fontSize.replace("px", "")
        : "16",
    }),
  });

  const [fontSize, setFontSize] = useState(editorState?.fontSize || "16");
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!Number.isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decrement}
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-accent"
        type="button"
      >
        <MinusIcon className="size-4" />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 text-sm text-center border border-input rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setFontSize(editorState?.fontSize || "16");
          }}
          className="h-7 w-10 text-sm text-center border border-transparent rounded-sm hover:bg-accent cursor-text"
          type="button"
        >
          {editorState?.fontSize || "16"}
        </button>
      )}
      <button
        onClick={increment}
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-accent"
        type="button"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

export const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      lineHeight: ctx.editor?.getAttributes("paragraph").lineHeight || "normal",
    }),
  });

  const lineHeights = [
    { label: "Default", value: "normal" },
    { label: "Single", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double", value: "2" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-accent p-0 overflow-hidden text-sm gap-y-0.5"
        >
          <ALargeSmallIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        {lineHeights.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "flex items-center gap-x-2",
              editorState?.lineHeight === value && "bg-accent",
            )}
          >
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
