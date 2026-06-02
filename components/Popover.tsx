"use client";

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type PopoverPlacement =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "center";

type PopoverApi = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type PopoverWidth = "auto" | "trigger" | "parent";

type PopoverProps = {
  trigger: (api: PopoverApi) => ReactNode;
  child: ReactNode | ((api: PopoverApi) => ReactNode);

  placement?: PopoverPlacement;
  offset?: number;
  closeOnOutsideClick?: boolean;

  /**
   * Styling for the popover window.
   */
  className?: string;
  width?: PopoverWidth;
};

export function Popover({
  trigger,
  child,
  placement = "bottom-left",
  offset = 8,
  closeOnOutsideClick = true,
  className = "",
  width = "parent"
}: PopoverProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties | null>(null);
  const [mounted, setMounted] = useState(false);

  const api = useMemo<PopoverApi>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [isOpen]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerEl = triggerRef.current!;
      const triggerRect = triggerEl.getBoundingClientRect();
      const parentRect = triggerEl.parentElement?.getBoundingClientRect();

      setStyle({
        ...getPopoverStyle(triggerRect, placement, offset),
        width:
          width === "trigger"
            ? triggerRect.width
            : width === "parent"
              ? parentRect?.width
              : undefined,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, placement, offset]);

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedPopover = popoverRef.current?.contains(target);

      if (!clickedTrigger && !clickedPopover) {
        api.close();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, closeOnOutsideClick, api]);

  return (
    <>
      <div ref={triggerRef}>
        {trigger(api)}
      </div>

      {mounted &&
        isOpen &&
        style &&
        createPortal(
          <div
            ref={popoverRef}
            style={style}
            className={
              className ?? "z-50"
            }
          >
            {typeof child === "function" ? child(api) : child}
          </div>,
          document.body
        )}
    </>
  );
}

function getPopoverStyle(
  rect: DOMRect,
  placement: PopoverPlacement,
  offset: number
): CSSProperties {
  const base: CSSProperties = {
    position: "fixed",
    zIndex: 50,
  };

  switch (placement) {
    case "top-left":
      return {
        ...base,
        left: rect.left,
        top: rect.top - offset,
        transform: "translateY(-100%)",
      };

    case "top-center":
      return {
        ...base,
        left: rect.left + rect.width / 2,
        top: rect.top - offset,
        transform: "translate(-50%, -100%)",
      };

    case "top-right":
      return {
        ...base,
        left: rect.right,
        top: rect.top - offset,
        transform: "translate(-100%, -100%)",
      };

    case "bottom-left":
      return {
        ...base,
        left: rect.left,
        top: rect.bottom + offset,
      };

    case "bottom-center":
      return {
        ...base,
        left: rect.left + rect.width / 2,
        top: rect.bottom + offset,
        transform: "translateX(-50%)",
      };

    case "bottom-right":
      return {
        ...base,
        left: rect.right,
        top: rect.bottom + offset,
        transform: "translateX(-100%)",
      };

    case "left-top":
      return {
        ...base,
        left: rect.left - offset,
        top: rect.top,
        transform: "translateX(-100%)",
      };

    case "left-center":
      return {
        ...base,
        left: rect.left - offset,
        top: rect.top + rect.height / 2,
        transform: "translate(-100%, -50%)",
      };

    case "left-bottom":
      return {
        ...base,
        left: rect.left - offset,
        top: rect.bottom,
        transform: "translate(-100%, -100%)",
      };

    case "right-top":
      return {
        ...base,
        left: rect.right + offset,
        top: rect.top,
      };

    case "right-center":
      return {
        ...base,
        left: rect.right + offset,
        top: rect.top + rect.height / 2,
        transform: "translateY(-50%)",
      };

    case "right-bottom":
      return {
        ...base,
        left: rect.right + offset,
        top: rect.bottom,
        transform: "translateY(-100%)",
      };

    case "center":
      return {
        ...base,
        left: rect.left + rect.width / 2,
        top: rect.top + rect.height / 2,
        transform: "translate(-50%, -50%)",
      };
  }
}