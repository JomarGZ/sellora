import { Toast, type ToastMessage } from "primereact/toast";
import { useRef, createContext, useContext, type ReactNode } from "react";

type ToastContextType = {
  showToast: (message: ToastMessage) => void;
};
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const AppToastProvider = ({ children }: { children: ReactNode }) => {
  const toastRef = useRef<Toast>(null);

  const showToast = (message: ToastMessage) => {
    toastRef.current?.show(message);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};

export const useAppToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within AppToastProvider");
  }
  return context;
};
