import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max width class, default "max-w-md" */
  maxWidth?: string;
  /** If true dialog is wider with a fixed height scroll container */
  scrollable?: boolean;
  /** Close when clicking the backdrop overlay */
  closeOnOverlayClick?: boolean;
}

/**
 * Shared Dialog / Modal wrapper.
 * - White (#FFFFFF) background
 * - Light gray border (border-slate-200)
 * - Subtle overlay (bg-black/20) — no deep dark / no bluish overlay
 * - Rounded-2xl corners, soft shadow
 * - ESC to close
 */
export function Dialog({
  open,
  onClose,
  children,
  maxWidth = "max-w-md",
  scrollable = false,
  closeOnOverlayClick = true,
}: DialogProps) {
  // ESC key handler
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.22)" }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={`relative w-full ${maxWidth} bg-white border border-slate-200 rounded-2xl shadow-xl ${scrollable ? "max-h-[90vh] overflow-hidden flex flex-col" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

export function DialogHeader({ title, icon, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-[#1455BD]">{icon}</span>}
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
        aria-label="Хаах"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function DialogBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-5 ${className}`}>{children}</div>
  );
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
      {children}
    </div>
  );
}

/** Simple confirmation dialog */
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "warning";
  icon?: React.ReactNode;
}

const variantConfig = {
  primary: {
    bg: "bg-blue-50",
    text: "text-[#1455BD]",
    btn: "bg-[#1455BD] hover:bg-[#0d3a8a] text-white",
  },
  danger: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    btn: "bg-rose-600 hover:bg-rose-700 text-white",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
  },
};

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = "Баталгаажуулах", cancelLabel = "Цуцлах",
  variant = "primary", icon,
}: ConfirmDialogProps) {
  const cfg = variantConfig[variant];
  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-sm">
      <DialogBody className="text-center py-8">
        {icon && (
          <div className={`w-14 h-14 ${cfg.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className={`${cfg.text} [&>svg]:w-7 [&>svg]:h-7`}>{icon}</span>
          </div>
        )}
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        {description && <p className="text-sm text-slate-500 leading-relaxed">{description}</p>}
      </DialogBody>
      <DialogFooter>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${cfg.btn}`}
        >
          {confirmLabel}
        </button>
      </DialogFooter>
    </Dialog>
  );
}

/** Slide-in right-side panel (drawer) */
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export function Drawer({ open, onClose, children, width = "max-w-md" }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-full w-full ${width} bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col`}>
        {children}
      </div>
    </>
  );
}
