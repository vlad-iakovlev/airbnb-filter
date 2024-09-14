import assert from "assert";
import { createRoot } from "react-dom/client";
import { Popup } from "@/features/popup/index.jsx";
import "@/styles.css";

const rootEl = document.getElementById("root");
assert(rootEl, "Root element not found");

const root = createRoot(rootEl);
root.render(<Popup />);
