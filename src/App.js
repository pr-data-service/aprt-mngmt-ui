import React from 'react';
import AppRouter from './appRouter';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AppContextProvider } from './components/common/context/appContext';
import LocalStorageHandler from './utils/localStorageHandler';

const App = () => {


    React.useEffect(() => {
        //creating index while app initialized. If not found then creates.
        LocalStorageHandler.createIndex();
      }, []);

    return <SnackbarProvider maxSnack={3}>
            <AppContextProvider value={{}}>
                <AppRouter />
            </AppContextProvider>
        </SnackbarProvider>
}

export default App;