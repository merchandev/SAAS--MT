"use client";

import { useEffect } from "react";

export default function DeveloperCredits() {
  useEffect(() => {
    // 1. Añadir el comentario en el DOM (Elements)
    const commentText = `\n\n   ███╗   ███╗███████╗██████╗  ██████╗██╗  ██╗ █████╗ ███╗   ██╗    ██████╗ ███████╗██╗   ██╗\n   ████╗ ████║██╔════╝██╔══██╗██╔════╝██║  ██║██╔══██╗████╗  ██║    ██╔══██╗██╔════╝██║   ██║\n   ██╔████╔██║█████╗  ██████╔╝██║     ███████║███████║██╔██╗ ██║    ██║  ██║█████╗  ██║   ██║\n   ██║╚██╔╝██║██╔══╝  ██╔══██╗██║     ██╔══██║██╔══██║██║╚██╗██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝\n   ██║ ╚═╝ ██║███████╗██║  ██║╚██████╗██║  ██║██║  ██║██║ ╚████║    ██████╔╝███████╗ ╚████╔╝ \n   ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═════╝ ╚══════╝  ╚═══╝  \n\n   🚀 Sistema diseñado y desarrollado por MERCHAN.DEV\n   🌐 Visita: https://merchan.dev\n\n`;
    
    // Evitar duplicados si se re-renderiza
    let exists = false;
    for (let i = 0; i < document.head.childNodes.length; i++) {
      if (document.head.childNodes[i].nodeType === 8 && document.head.childNodes[i].nodeValue?.includes('MERCHAN.DEV')) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      const comment = document.createComment(commentText);
      // Lo insertamos como el primer elemento del <head> para que sea súper visible a simple vista
      document.head.prepend(comment);
    }

    // 2. Añadir también un mensaje elegante en la Consola
    const consoleStyle1 = "color: #D4AF37; font-size: 20px; font-weight: bold; text-shadow: 1px 1px 2px black; padding: 10px 0;";
    const consoleStyle2 = "color: #fff; font-size: 14px; background: #061833; padding: 5px 10px; border-radius: 5px; border: 1px solid #D4AF37;";
    
    console.log("%c🚀 MERCHAN.DEV", consoleStyle1);
    console.log("%cEste sistema fue desarrollado por MERCHAN.DEV - https://merchan.dev", consoleStyle2);
  }, []);

  return null; // Este componente no renderiza nada en la pantalla
}
