import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Repository {
	id: string;
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	license: string | null;
}

export interface RepositoriesState {
	items: Repository[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: RepositoriesState = {
	items: [],
	status: 'idle',
	error: null,
};

export const fetchRepositories = createAsyncThunk(
	'repositories/fetchRepositories',
	async ({ query, perPage, page }: { query: string; perPage: number; page: number }) => {
		const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=${perPage}&page=${page}`);
		return (await response.json()).items as Repository[];
	}
);

const repositoriesSlice = createSlice({
	name: 'repositories',
	initialState,
	reducers: {
		clearRepositories: (state) => {
			state.items = [];
			state.status = 'idle';
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepositories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchRepositories.fulfilled, (state, action) => {
				state.items = [...state.items, ...action.payload];
				state.status = 'succeeded';
			})
			.addCase(fetchRepositories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || null;
			});
	},
});

export const { clearRepositories } = repositoriesSlice.actions;

export default repositoriesSlice.reducer;