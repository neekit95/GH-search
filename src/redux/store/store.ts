import { configureStore } from '@reduxjs/toolkit';
import repositoriesReducer from '../slices/repositoriesSlice';
import loadingReducer from '../slices/loadingSlice';

// Создание Redux store с редьюсерами для управления состоянием репозиториев и загрузки.
const store = configureStore({
    reducer: {
        // Редьюсер для управления состоянием репозиториев.
        repositories: repositoriesReducer,

        // Редьюсер для управления состоянием загрузки.
        loading: loadingReducer,
    },
});

// Определение типа для dispatch из Redux store.
export type AppDispatch = typeof store.dispatch;

// Определение типа для состояния Redux store.
export type RootState = ReturnType<typeof store.getState>;

// Экспорт созданного Redux store.
export default store;