// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useState } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    const [isLogged, setIsLogged] = useState(false);
    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch, isLogged, setIsLogged }}>
        {children}
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const { dispatch, store, isLogged, setIsLogged } = useContext(StoreContext);
    //const [isLogged, setIsLogged] = useState(false);
    return { dispatch, store, isLogged, setIsLogged };
}