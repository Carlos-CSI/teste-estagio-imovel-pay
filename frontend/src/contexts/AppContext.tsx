import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

interface AppContextData {
  addToast: (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    options?: Partial<ToastOptions>
  ) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'warning' | 'info', message: string, options?: Partial<ToastOptions>) => {
      const toastOptions: ToastOptions = {
        ...options,
        autoClose: options?.autoClose ?? 5000,
        pauseOnHover: options?.pauseOnHover ?? true,
        pauseOnFocusLoss: options?.pauseOnFocusLoss ?? true,
        closeOnClick: options?.closeOnClick ?? true,
        draggable: options?.draggable ?? true,
        position: options?.position ?? 'top-right',
      } as ToastOptions;

      switch (type) {
        case 'success':
          toast.success(message, toastOptions);
          break;
        case 'error':
          toast.error(message, toastOptions);
          break;
        case 'warning':
          toast.warning(message, toastOptions);
          break;
        default:
          toast.info(message, toastOptions);
          break;
      }
    },
    []
  );

  const toggleSidebar = useCallback(() => setIsSidebarOpen((s) => !s), []);

  return (
    <AppContext.Provider
      value={{ addToast, isLoading, setIsLoading, isSidebarOpen, toggleSidebar }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextData => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
