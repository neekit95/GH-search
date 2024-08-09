import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from '../slices/loadingSlice';
import repositoriesSlice from '../slices/repositoriesSlice';

const store = configureStore({
    reducer: {
        loading: loadingSlice,
        repositories: repositoriesSlice,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;