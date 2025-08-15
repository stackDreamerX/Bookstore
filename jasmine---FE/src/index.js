import "@glints/poppins";
import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Removed this import
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./assets/css/reset.css";
import "./assets/css/style.css";
import "./index.css";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
    {/* Removed the ReactQueryDevtools component */}
  </QueryClientProvider>
  // </React.StrictMode>
);
