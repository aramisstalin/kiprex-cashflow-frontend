"use client";

/**
 * Modal — accessible dialog with animated overlay.
 */

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg";
}

const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = "md",
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    // Trap focus
    useEffect(() => {
        if (!isOpen || !contentRef.current) return;

        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        first?.focus();

        const handler = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === overlayRef.current) onClose();
        },
        [onClose],
    );

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-foreground/20 backdrop-blur-sm
        animate-fade-in
      "
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            <div
                ref={contentRef}
                className={`
          w-full ${sizeStyles[size]}
          rounded-[var(--radius-xl)] bg-card border border-border
          shadow-[var(--shadow-xl)] p-6
          animate-scale-in
        `}
            >
                {(title || description) && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            {title && (
                                <h2 id="modal-title" className="text-heading-2 text-card-foreground">
                                    {title}
                                </h2>
                            )}
                            <button
                                onClick={onClose}
                                className="
                  p-2 rounded-[var(--radius-sm)] text-muted-foreground
                  hover:bg-accent hover:text-foreground
                  transition-colors duration-[var(--duration-fast)]
                  focus-ring
                "
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {description && (
                            <p className="text-body-sm text-muted-foreground mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
