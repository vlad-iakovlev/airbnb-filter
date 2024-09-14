import { createPortal } from "react-dom";

export interface PortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: PortalProps) =>
  createPortal(children, document.body);
