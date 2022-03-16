import { useEffect } from "react";

export const useClickOutside = (
  ref: any,
  handler: (event: MouseEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target) || null) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    //document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      //document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
