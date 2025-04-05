import { createContext } from "react";
import AppState from "./AppState.jsx";

const AppContext = createContext(AppState);

export default AppContext;