import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen(!open) }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    // Safe fallback so components don't crash if provider not mounted
    return { open: false, setOpen: () => {}, toggle: () => {} };
  }
  return ctx;
};
