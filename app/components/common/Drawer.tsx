import { useState, createContext, useContext, cloneElement } from "react";
import { Close } from "./Icons";

type DrawerContextType = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
];

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

type DrawerProps = {
  open?: boolean;
  children: React.ReactNode;
};

export function DrawerProvider(props: DrawerProps) {
  const [open, setOpen] = useState(props.open ? props.open : false);

  return (
    <DrawerContext.Provider value={[open, setOpen]}>
      {props.children}
    </DrawerContext.Provider>
  );
}

type DrawerContentProps = {
  children: React.ReactNode;
  onClose?: Function;
};

export function DrawerContent(props: DrawerContentProps) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("DrawerContent must be used within a Drawer");
  }
  const [open, setOpen] = context;

  return (
    <>
      {open && (
        <div
          className="fixed pointer-events-auto bg-black/[.85] backdrop-blur-sm top-0 right-0 bottom-0 left-0 z-50 !m-0"
          id="Drawer"
        >
          <div className="relative bg-white p-7 space-y-5 md:w-1/3 min-w-96 flex flex-col h-full animate-drawer ml-auto overflow-y-auto">
            <button onClick={() => setOpen(false)} className="flex ml-auto">
              <Close />
            </button>
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}

export function DrawerButton(props: { children: JSX.Element }) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("DrawerContent must be used within a Drawer");
  }
  const [, setOpen] = context;

  return cloneElement(props.children, {
    onClick: () => {
      setOpen(true);
    },
  });
}

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
};
