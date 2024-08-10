import { configureStore } from '@reduxjs/toolkit';
import repositoriesReducer from '../slices/repositoriesSlice';
import loadingReducer from '../slices/loadingSlice';

const store = configureStore({
    reducer: {
        repositories: repositoriesReducer,
        loading: loadingReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;