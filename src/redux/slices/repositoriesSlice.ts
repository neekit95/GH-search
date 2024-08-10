import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {License} from "../../components/search-result/data-table/data-table.tsx";
// Интерфейс для описания данных репозитория.
export interface Repository {
	// Уникальный идентификатор репозитория.
	id: string;

	// Название репозитория.
	name: string;

	// Язык программирования, использованный в репозитории.
	language: string;

	// Количество форков репозитория.
	forks_count: number;

	// Количество звезд репозитория.
	stargazers_count: number;

	// Дата последнего обновления репозитория.
	updated_at: string;

	// Описание репозитория.
	description: string;

	// Лицензия репозитория (может быть строкой или null).
	license: License | null;
}

// Интерфейс состояния хранилища репозиториев.
export interface RepositoriesState {
	// Массив репозиториев.
	items: Repository[];

	// Статус загрузки репозиториев. idle - начальное состояние, без загрузки
	status: 'idle' | 'loading' | 'succeeded' | 'failed';

	// Сообщение об ошибке, если ошибка произошла.
	error: string | null;
}

// Начальное состояние для слайса репозиториев.
const initialState: RepositoriesState = {
	items: [],         // Изначально нет репозиториев.
	status: 'idle',    // Изначально состояние ожидания.
	error: null,       // Изначально нет ошибок.
};

// Асинхронное действие для получения репозиториев.
export const fetchRepositories = createAsyncThunk(
	'repositories/fetchRepositories',
	async ({ query, perPage, page }: { query: string; perPage: number; page: number }) => {
		console.log(`Fetching repositories with query: ${query}, perPage: ${perPage}, page: ${page}`);
		const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=${perPage}&page=${page}`);
		const data = await response.json();
		console.log(`Received ${data.items.length} repositories`);
		return data.items as Repository[];
	}
);

// Создание слайса для управления состоянием репозиториев.
const repositoriesSlice = createSlice({
	name: 'repositories',  // Имя слайса, используется для действий и в Redux DevTools.
	initialState,          // Начальное состояние слайса.
	reducers: {
		// Редьюсер для очистки списка репозиториев.
		clearRepositories: (state) => {
			console.log('Clearing repositories');
			state.items = [];          // Очищаем массив репозиториев.
			state.status = 'idle';     // Сбрасываем статус.
			state.error = null;        // Убираем сообщение об ошибке.
		},
	},
	extraReducers: (builder) => {
		// Определяем обработку различных состояний асинхронного действия.
		builder
			.addCase(fetchRepositories.pending, (state) => {
				console.log('Fetching repositories pending');
				state.status = 'loading'; // Устанавливаем статус загрузки.
			})
			.addCase(fetchRepositories.fulfilled, (state, action) => {
				console.log('Fetching repositories succeeded');
				state.items = [...state.items, ...action.payload]; // Обновляем массив репозиториев.
				state.status = 'succeeded';  // Устанавливаем статус успешного завершения.
			})
			.addCase(fetchRepositories.rejected, (state, action) => {
				console.error('Fetching repositories failed', action.error.message);
				state.status = 'failed';     // Устанавливаем статус ошибки.
				state.error = action.error.message || null; // Сохраняем сообщение об ошибке.
			});
	},
});

// Экспорт действия для очистки репозиториев.
export const { clearRepositories } = repositoriesSlice.actions;

// Экспорт редьюсера для использования в Redux store.
export default repositoriesSlice.reducer;