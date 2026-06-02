"use client";

import { ui } from "@/lib/styles";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type NotificationContent = ReactNode;

type NotificationState = {
  id: number;
  content: NotificationContent;
};

type NotificationContextValue = {
  showNotification: (content: NotificationContent) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const showNotification = useCallback((content: NotificationContent) => {
    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      {
        id,
        content,
      },
    ]);

    window.setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  const value = useMemo(
    () => ({ showNotification }),
    [showNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return ctx;
}

type NotificationContainerProps = {
  notifications: NotificationState[];
  onClose: (id: number) => void;
};

export function NotificationContainer({
  notifications,
  onClose,
}: NotificationContainerProps) {
  if (notifications.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-3 z-[1000] flex flex-col-reverse gap-3 items-start">
      {notifications.map((notification) => (
        <button
          key={notification.id}
          type="button"
          onClick={() => onClose(notification.id)}
        >
          {notification.content}
        </button>
      ))}
    </div>,
    document.body
  );
}