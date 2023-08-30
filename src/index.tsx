import ReactDOM from "react-dom/client";
import App from "./App";
import "src/assets/styles/global/index.css";

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
