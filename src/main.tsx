import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./form.tsx";
import "./index.css";
import emailjs from "@emailjs/browser";

emailjs.init({
	publicKey: import.meta.env.VITE_PUBLIC_KEY,
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
