// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que cambia la ruta (pathname), subimos la ventana a (0,0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Este componente no renderiza nada visual
};

export default ScrollToTop;