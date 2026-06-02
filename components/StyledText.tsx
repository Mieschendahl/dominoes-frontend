import React from "react";
import { ui } from "@/lib/styles";

export const CLASS_TOKEN_MAP: Record<string, string> = {
    red: "text-red-300/90",
    blue: "text-blue-300/80",
    green: "text-green-200/80",
    yellow: "text-yellow-200/80",
    violet: "text-violet-300/80",
    black: "text-black/80",
    gray: "text-white/40",
    white: "text-white/80",
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
};

function parseStyledText(text: string): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];
    const regex = /\$tyle\{([^}]*)\}\{([^}]*)\}/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        const fullMatch = match[0];
        const tokenString = match[1].trim();
        const content = match[2];
        const matchIndex = match.index;

        if (matchIndex > lastIndex) {
            nodes.push(
                <React.Fragment key={`text-${key++}`}>
                    {text.slice(lastIndex, matchIndex)}
                </React.Fragment>
            );
        }

        const tokens = tokenString.split(/\s+/).filter(Boolean);

        const mappedClasses = tokens
            .map((token) => CLASS_TOKEN_MAP[token])
            .filter(Boolean);

        nodes.push(
            <span key={`styled-${key++}`} className={ui(mappedClasses)}>
                {content}
            </span>
        );

        lastIndex = matchIndex + fullMatch.length;
    }

    if (lastIndex < text.length) {
        nodes.push(
            <React.Fragment key={`text-${key++}`}>
                {text.slice(lastIndex)}
            </React.Fragment>
        );
    }

    return nodes;
}

type StyledTextProps = React.ComponentPropsWithoutRef<"span"> & {
    value: string;
};

export function StyledText({
    value: text,
    className,
    ...props
}: StyledTextProps) {
    return (
        <span className={ui(className)} {...props}>
            {parseStyledText(text)}
        </span>
    );
}