import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Repository {
	id: string;
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	license: string | null;
}

interface RepositoriesState {
	data: Repository[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RepositoriesState = {
	data: [],
	status: 'idle',
};

export const fetchRepositories = createAsyncThunk(
	'repositories/fetchRepositories',
	async ({ query, perPage, page }: { query: string; perPage: number; page: number }) => {
		const response = await axios.get(`https://api.github.com/search/repositories`, {
			params: {
				q: query,
				per_page: perPage,
				page,
			},
		});
		return response.data.items;
	}
);

const repositoriesSlice = createSlice({
	name: 'repositories',
	initialState,
	reducers: {
		clearRepositories(state) {
			state.data = []; // Очистка данных репозиториев
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepositories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchRepositories.fulfilled, (state, action: PayloadAction<Repository[]>) => {
				state.status = 'succeeded';
				state.data = [...state.data, ...action.payload]; // Добавляем новые репозитории
			})
			.addCase(fetchRepositories.rejected, (state) => {
				state.status = 'failed';
			});
	},
});

export const { clearRepositories } = repositoriesSlice.actions;
export default repositoriesSlice.reducer;