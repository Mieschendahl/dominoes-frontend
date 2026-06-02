"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DialogContent = ReactNode;

type DialogState = {
  id: string;
  content: DialogContent;
};

type OpenDialogOptions = {
  key?: string;
};

type DialogKey = string;

type DialogContextValue = {
  openDialog: (content: DialogContent, options?: OpenDialogOptions) => void;
  closeDialog: (key?: DialogKey) => void;
  closeAllDialogs: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

let dialogIdCounter = 0;

function createDialogId() {
  dialogIdCounter += 1;
  return `dialog-${dialogIdCounter}`;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogState[]>([]);

  const closeDialog = useCallback((key?: DialogKey) => {
  setDialogs((dialogs) => {
    if (key == null) {
      return dialogs.slice(0, -1);
    }

    return dialogs.filter((dialog) => dialog.id !== key);
  });
}, []);

  const closeAllDialogs = useCallback(() => {
    setDialogs([]);
  }, []);

  const openDialog = useCallback(
    (content: DialogContent, options?: OpenDialogOptions) => {
      const id = options?.key ?? createDialogId();

      setDialogs((prev) => {
        return [
          ...prev.filter(dialog => dialog.id !== id),
          {
            id,
            content,
          },
        ];
      });
    },
    []
  );

  const value = useMemo(
    () => ({ openDialog, closeDialog, closeAllDialogs }),
    [openDialog, closeDialog, closeAllDialogs]
  );

  return (
    <DialogContext.Provider value={value}>
      {children}

      {dialogs.map((dialog, index) => {
        const isTopDialog = index === dialogs.length - 1;

        return (
          <DialogContainer
            key={dialog.id}
            open
            isTopDialog={isTopDialog}
            zIndex={50 + index}
          >
            {dialog.content}
          </DialogContainer>
        );
      })}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);

  if (!ctx) {
    throw new Error("useDialog must be used inside DialogProvider");
  }

  return ctx;
}

type DialogContainerProps = {
  open: boolean;
  isTopDialog: boolean;
  zIndex: number;
  children: ReactNode;
};

export function DialogContainer({
  open,
  isTopDialog,
  zIndex,
  children,
}: DialogContainerProps) {
  if (!open) return null;

  return createPortal(
    <div
      className={[
        "fixed inset-0 flex items-center justify-center transition",
        !isTopDialog && "pointer-events-none",
        isTopDialog ? "backdrop-blur" : "pointer-events-none",
        // isTopDialog ? "bg-black/50" : "pointer-events-none",
      ].join(" ")}
      style={{ zIndex }}
    >
      <div
        role="dialog"
        aria-modal={isTopDialog}
        className={isTopDialog ? "" : "pointer-events-auto"}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}