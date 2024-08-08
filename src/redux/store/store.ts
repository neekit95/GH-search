import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from "../slices/loadingSlice.ts";

const store = configureStore({
    reducer: {
        loading: loadingSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;