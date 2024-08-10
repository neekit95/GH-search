import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Интерфейс состояния загрузки.
export interface LoadingState {
	// Флаг, указывающий, находится ли приложение в состоянии загрузки.
	isLoading: boolean;
}

// Начальное состояние для редьюсера загрузки.
const initialState: LoadingState = {
	isLoading: false, // По умолчанию загрузка не активна.
};

// Создание слайса для управления состоянием загрузки.
const loadingSlice = createSlice({
	name: 'loading', // Имя слайса, используется для действий и в Redux DevTools.
	initialState,    // Начальное состояние слайса.
	reducers: {
		// Редьюсер для установки состояния загрузки.
		setLoading(state, action: PayloadAction<boolean>) {
			// Обновление состояния на основе переданного значения.
			state.isLoading = action.payload;
		},
	},
});

// Экспорт действий для использования в компонентах и других частях приложения.
export const { setLoading } = loadingSlice.actions;

// Экспорт редьюсера для использования в Redux store.
export default loadingSlice.reducer;