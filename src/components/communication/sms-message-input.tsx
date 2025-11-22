/**
 * SMS Message Input Component
 * 
 * iPhone-style message input with emoji picker, attachments, and images
 */

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Camera,
    Image as ImageIcon,
    Paperclip,
    Send,
    Smile,
    X,
    Loader2,
} from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";

type Attachment = {
    id: string;
    file: File;
    preview?: string;
    type: "image" | "file";
};

type SmsMessageInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onAttach?: (files: File[]) => void;
    sending?: boolean;
    disabled?: boolean;
    placeholder?: string;
};

// Common emojis (iPhone Messages style)
const EMOJI_CATEGORIES = [
    {
        name: "Frequently Used",
        emojis: ["😀", "😂", "😍", "🥰", "😘", "😊", "😉", "😎", "🤔", "😏", "😒", "🙄", "😮", "🤗", "😴", "😋", "😝", "🤤", "😪", "😵"],
    },
    {
        name: "Smileys & People",
        emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔"],
    },
    {
        name: "Gestures",
        emojis: ["👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍"],
    },
    {
        name: "Objects",
        emojis: ["📱", "💻", "⌚", "🖥", "⌨️", "🖱", "🖲", "🕹", "🗜", "💾", "💿", "📀", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎️"],
    },
    {
        name: "Symbols",
        emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️"],
    },
];

export function SmsMessageInput({
    value,
    onChange,
    onSend,
    onAttach,
    sending = false,
    disabled = false,
    placeholder = "Text Message",
}: SmsMessageInputProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
        }
    }, [value]);

    const handleEmojiSelect = useCallback((emoji: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = value.slice(0, start) + emoji + value.slice(end);
            onChange(newValue);
            // Set cursor position after emoji
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        } else {
            onChange(value + emoji);
        }
        setShowEmojiPicker(false);
    }, [value, onChange]);

    const handleFileSelect = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newAttachments: Attachment[] = Array.from(files).map((file) => {
            const attachment: Attachment = {
                id: `${Date.now()}-${Math.random()}`,
                file,
                type: file.type.startsWith("image/") ? "image" : "file",
            };

            // Create preview for images
            if (attachment.type === "image") {
                attachment.preview = URL.createObjectURL(file);
            }

            return attachment;
        });

        setAttachments((prev) => [...prev, ...newAttachments]);
        if (onAttach) {
            onAttach(Array.from(files));
        }
    }, [onAttach]);

    const handleRemoveAttachment = useCallback((id: string) => {
        setAttachments((prev) => {
            const attachment = prev.find((a) => a.id === id);
            if (attachment?.preview) {
                URL.revokeObjectURL(attachment.preview);
            }
            return prev.filter((a) => a.id !== id);
        });
    }, []);

    const handleSend = useCallback(() => {
        if ((!value.trim() && attachments.length === 0) || sending || disabled) return;
        onSend();
        // Clear attachments after sending
        attachments.forEach((att) => {
            if (att.preview) {
                URL.revokeObjectURL(att.preview);
            }
        });
        setAttachments([]);
    }, [value, attachments, sending, disabled, onSend]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    return (
        <div className="sticky bottom-0 border-t border-border/50 bg-card">
            {/* Attachment Previews */}
            {attachments.length > 0 && (
                <div className="border-b border-border/50 p-2">
                    <ScrollArea className="w-full">
                        <div className="flex gap-2">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="relative group shrink-0"
                                >
                                    {attachment.type === "image" && attachment.preview ? (
                                        <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-border">
                                            <img
                                                src={attachment.preview}
                                                alt={attachment.file.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveAttachment(attachment.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative h-20 w-20 rounded-lg border border-border bg-muted flex items-center justify-center">
                                            <Paperclip className="h-6 w-6 text-muted-foreground" />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveAttachment(attachment.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}

            {/* Input Area */}
            <div className="p-3">
                <div className="flex items-end gap-2">
                    {/* Attachment Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 shrink-0 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled}
                        title="Attach file"
                    >
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="*/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />

                    {/* Camera/Image Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 shrink-0 rounded-full"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={disabled}
                        title="Take photo or choose image"
                    >
                        <Camera className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />

                    {/* Text Input */}
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className={cn(
                                "min-h-[44px] max-h-32 resize-none rounded-2xl pr-12 bg-muted/50 border-border focus:bg-background focus:ring-2 focus:ring-primary/20",
                                "text-sm leading-5"
                            )}
                            rows={1}
                            disabled={disabled || sending}
                        />
                    </div>

                    {/* Emoji Button */}
                    <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "h-9 w-9 p-0 shrink-0 rounded-full",
                                    showEmojiPicker && "bg-muted"
                                )}
                                disabled={disabled}
                                title="Add emoji"
                            >
                                <Smile className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="end"
                            className="w-[320px] p-0"
                        >
                            <ScrollArea className="h-[300px]">
                                <div className="p-3">
                                    {EMOJI_CATEGORIES.map((category, idx) => (
                                        <div key={category.name} className={idx > 0 ? "mt-4" : ""}>
                                            <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                                                {category.name}
                                            </h4>
                                            <div className="grid grid-cols-8 gap-1">
                                                {category.emojis.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center text-lg transition-colors"
                                                        onClick={() => handleEmojiSelect(emoji)}
                                                        title={emoji}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>

                    {/* Send Button */}
                    <Button
                        type="button"
                        onClick={handleSend}
                        disabled={(!value.trim() && attachments.length === 0) || sending || disabled}
                        size="sm"
                        className="h-11 w-11 rounded-full p-0 shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                        {sending ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
                        ) : (
                            <Send className="h-5 w-5 text-primary-foreground" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

