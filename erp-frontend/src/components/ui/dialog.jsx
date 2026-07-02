import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Button from "./Button";

/* ---------------- ROOT ---------------- */

export const Dialog = DialogPrimitive.Root;

/* ---------------- TRIGGER ---------------- */

export const DialogTrigger = DialogPrimitive.Trigger;

/* ---------------- PORTAL ---------------- */

export function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal {...props} />;
}

/* ---------------- CLOSE ---------------- */

export const DialogClose = DialogPrimitive.Close;

/* ---------------- OVERLAY ---------------- */

export function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

/* ---------------- CONTENT ---------------- */

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-xl bg-white p-5 shadow-lg outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-3 top-3"
            >
              <XIcon size={16} />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/* ---------------- HEADER ---------------- */

export function DialogHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1 mb-3", className)} {...props} />
  );
}

/* ---------------- FOOTER ---------------- */

export function DialogFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex justify-end gap-2 mt-4", className)} {...props}>
      {children}
    </div>
  );
}

/* ---------------- TITLE ---------------- */

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

/* ---------------- DESCRIPTION ---------------- */

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}
