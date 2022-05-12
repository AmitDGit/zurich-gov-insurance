import { useEffect } from "react";

function useSetNavMenu(param, action) {
  useEffect(() => {
    if (action) {
      action(param);
    }
  }, []);
  return true;
}

export default useSetNavMenu;
