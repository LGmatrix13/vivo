import { useState, createContext, useContext, cloneElement } from "react";

const DrawerContext = createContext(useState(false));

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
  const [open, setOpen] = useContext(DrawerContext);

  return (
    <>
      {open && (
        <div
          className="fixed pointer-events-auto bg-black/[.8] top-0 right-0 bottom-0 left-0 z-50 !m-0"
          onClick={() => {
            setOpen(false);
            props.onClose && props.onClose();
          }}
          id="Drawer"
        >
          <div
            className="relative bg-white p-10 space-y-5 w-1/2 flex flex-col h-full animate-drawer ml-auto overflow-y-scroll"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}

function DrawerButton(props: { children: JSX.Element }) {
  const [, setOpen] = useContext(DrawerContext);

  return cloneElement(props.children, {
    onClick: () => setOpen(true),
  });
}

export { DrawerContext, Drawer, DrawerButton, DrawerContent };
