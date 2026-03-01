interface AvatarProps {
    src?: string | null;
    name: string;
    size?: "sm" | "md" | "lg";
    status?: "online" | "offline" | "away" | null;
    className?: string;
}

const sizeStyles = {
    sm: "h-8 w-8 text-caption",
    md: "h-10 w-10 text-body-sm",
    lg: "h-14 w-14 text-body-lg",
};

const statusSizeStyles = {
    sm: "h-2.5 w-2.5 -bottom-0 -right-0",
    md: "h-3 w-3 -bottom-0.5 -right-0.5",
    lg: "h-3.5 w-3.5 -bottom-0.5 -right-0.5",
};

const statusColors = {
    online: "bg-success",
    offline: "bg-muted-foreground",
    away: "bg-warning",
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function Avatar({
    src,
    name,
    size = "md",
    status = null,
    className = "",
}: AvatarProps) {
    return (
        <div className={`relative inline-flex flex-shrink-0 ${className}`}>
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className={`
            rounded-full object-cover ring-2 ring-background
            ${sizeStyles[size]}
          `}
                />
            ) : (
                <div
                    className={`
            flex items-center justify-center rounded-full
            bg-primary/10 text-primary font-semibold
            ring-2 ring-background
            ${sizeStyles[size]}
          `}
                    aria-label={name}
                >
                    {getInitials(name)}
                </div>
            )}
            {status && (
                <span
                    className={`
            absolute block rounded-full ring-2 ring-background
            ${statusColors[status]}
            ${statusSizeStyles[size]}
          `}
                />
            )}
        </div>
    );
}
