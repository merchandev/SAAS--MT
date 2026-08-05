"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileSidebarToggle() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="md:hidden mr-2" 
      onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}
