"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input(
        { label, error, helpText, leftIcon, rightIcon, className = "", id, ...props },
        ref,
    ) {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-body-sm font-medium text-foreground"
                    >
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftIcon && (
                        <span className="absolute left-3 text-muted-foreground">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              w-full h-10 rounded-[var(--radius-md)] border bg-background
              px-3 text-body text-foreground placeholder:text-muted-foreground
              transition-colors duration-[var(--duration-fast)]
              focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${error ? "border-destructive focus:ring-destructive" : "border-input"}
              ${className}
            `}
                        {...props}
                    />
                    {rightIcon && (
                        <span className="absolute right-3 text-muted-foreground">
                            {rightIcon}
                        </span>
                    )}
                </div>
                {error && (
                    <p className="text-caption text-destructive">{error}</p>
                )}
                {helpText && !error && (
                    <p className="text-caption text-muted-foreground">{helpText}</p>
                )}
            </div>
        );
    },
);
