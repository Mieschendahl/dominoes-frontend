import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function ui(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uiTextColor = ui("text-white/80");
export const uiTextColorWeak = ui("text-white/40");
export const uiSelectedColor = ui("opacity-75");
export const uiBg = ui("bg-white/5");
export const uiBgSelected = ui("bg-white/10");
export const uiBgHover = ui("hover:bg-white/10");
export const uiBgHoverDisable = ui(`hover:bg-white/5`);
export const uiBgFocus = ui("focus:bg-white/10");
export const uiP = ui("px-2 py-1");
export const uiGap = ui("gap-x-1 gap-y-1");
export const uiGapText = ui("gap-x-1 gap-y-1");
export const uiGapItems = ui("gap-1");
export const uiRounded = ui("rounded-sm");
export const uiPanel = ui(uiRounded, uiP, uiBg);
export const uiBigPanel = ui(uiRounded, "px-2 py-3", uiBg);
export const uiText = ui("min-h-[1lh] text-md font-normal select-none cursor-default", uiTextColor);
export const uiTextWeak = ui(uiText, "select-none cursor-default", uiTextColorWeak);
export const uiTextTiny = ui(uiTextWeak, "text-xs");
export const uiTitle = ui(uiText, "font-semibold select-none cursor-default", uiTextColor);
export const uiTitleWeak = ui(uiTitle, uiTextColorWeak);
export const uiIcon = ui("w-7 h-7");
export const uiInput = ui(uiPanel, uiText, "focus:outline-none", uiBgHover, uiBgFocus, "rounded-none", uiRounded);
export const uiNotification = ui(uiGap, uiTitle, "flex items-center backdrop-blur select-none cursor-pointer");
// export const uiButton = ui(uiPanel, uiTitle, "select-none cursor-default shadow-sm shadow-black/10", uiBgHover);
// export const uiButtonDisabled = ui(uiPanel, uiTitle, uiTextColorWeak, "select-none cursor-default shadow-sm shadow-black/10");
export const uiButton = ui(
    uiPanel,
    uiTitle,
    "relative overflow-hidden",
    "select-none cursor-pointer",
    // "border border-white/10",
    // "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    "transition-all duration-150",
    "before:absolute before:inset-x-0 before:top-0 before:h-1/2",
    "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
    "before:pointer-events-none",
    "hover:bg-white/10",
    "bg-white/5"
);
export const uiButtonDisabled = ui(
    uiPanel,
    uiTitle,
    uiTextColorWeak,
    "relative overflow-hidden",
    "select-none cursor-default",
    // "border border-white/10",
    // "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
    "transition-all duration-150",
    "before:absolute before:inset-x-0 before:top-0 before:h-1/2",
    "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
    "before:pointer-events-none",
    "bg-white/5"
);