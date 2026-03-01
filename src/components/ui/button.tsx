"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost:
        "text-foreground hover:bg-accent",
    danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    outline:
        "border border-border text-foreground hover:bg-accent",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-body-sm gap-1.5 rounded-[var(--radius-sm)]",
    md: "h-10 px-4 text-body gap-2 rounded-[var(--radius-md)]",
    lg: "h-12 px-6 text-body-lg gap-2.5 rounded-[var(--radius-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            className = "",
            disabled,
            children,
            ...props
        },
        ref,
    ) {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]
          focus-ring touch-target
          disabled:pointer-events-none disabled:opacity-50
          active:scale-[0.98]
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    },
);
