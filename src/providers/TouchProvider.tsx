import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

const TouchContext = createContext<boolean | undefined>(undefined);

export const TouchProvider = (props: PropsWithChildren) => {
  const [isTouch, setTouch] = useState<boolean>();

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return <TouchContext.Provider value={isTouch} {...props} />;
};

export const useTouch = () => useContext(TouchContext);
