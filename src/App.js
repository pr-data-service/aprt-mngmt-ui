import React from 'react';
import AppRouter from './appRouter';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AppContextProvider } from './components/common/context/appContext';

const App = () => {

    return <SnackbarProvider maxSnack={3}>
            <AppContextProvider value={{}}>
                <AppRouter />
            </AppContextProvider>
        </SnackbarProvider>
}

export default App;