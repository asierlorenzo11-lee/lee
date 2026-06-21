"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function SidePanel({
  open,
  onOpenChange,
  title,
  side = "right",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  side?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className={`fixed top-0 z-50 h-full w-full max-w-sm overflow-y-auto border-line bg-paper p-6 shadow-xl focus:outline-none ${
            side === "right" ? "right-0 border-l" : "left-0 border-r"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="font-serif text-xl italic">
              {title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {title}
            </Dialog.Description>
            <Dialog.Close
              aria-label="Cerrar"
              className="rounded p-1 text-ink-soft hover:text-ink"
            >
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
