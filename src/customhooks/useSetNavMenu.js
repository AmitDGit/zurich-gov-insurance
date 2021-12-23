import { useEffect } from "react";

function useSetNavMenu(param, action) {
  useEffect(() => {
    action(param);
  }, []);
  return true;
}

export default useSetNavMenu;
