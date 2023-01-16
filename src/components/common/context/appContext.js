import React, { useState, createContext, useContext } from "react";
import AppBackDrop from "../appBackDrop";
import AppDialog from "../appDialog";

const AppContext = createContext();


const AppContextProvider = ({ children, value, ...otherProps }) => {
    const appBackDropRef = React.useRef(null);
    const appDialogRef = React.useRef(null);

    const getAppContextProps = () => {
        return {
            handleBackDrop: (value) => {
                appBackDropRef.current.handleBackDrop(value);
            },
            handleDialogOpen: (value) => {
                appDialogRef.current.handleOpen(value);
            },
            handleDialogClose: () => {
                appDialogRef.current.handleClose();
            }
        }
    }

    return <AppContext.Provider value={{ ...getAppContextProps(), ...value }}>
        {children}
        <AppBackDrop ref={appBackDropRef} />
        <AppDialog ref={appDialogRef} />
    </AppContext.Provider>
}

export { AppContext, AppContextProvider }