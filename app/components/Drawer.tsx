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

function Drawer(props: DrawerProps) {
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

function DrawerContent(props: DrawerContentProps) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("DrawerContent must be used within a Drawer");
  }
  const [open, setOpen] = context;

  return (
    <>
      {open && (
        <div
          className="fixed pointer-events-auto bg-black/[.8] top-0 right-0 bottom-0 left-0 z-50 !m-0"
          id="Drawer"
        >
          <div className="relative bg-white p-7 space-y-5 w-1/2 flex flex-col h-full animate-drawer ml-auto overflow-y-scroll">
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

function DrawerButton(props: { children: JSX.Element }) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("DrawerContent must be used within a Drawer");
  }
  const [open, setOpen] = context;

  return cloneElement(props.children, {
    onClick: () => setOpen(true),
  });
}

export { DrawerContext, Drawer, DrawerButton, DrawerContent };
