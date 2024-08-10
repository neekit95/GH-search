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
		console.log(`Fetching repositories with query: ${query}, perPage: ${perPage}, page: ${page}`);
		const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=${perPage}&page=${page}`);
		const data = await response.json();
		console.log(`Received ${data.items.length} repositories`);
		return data.items as Repository[];
	}
);

const repositoriesSlice = createSlice({
	name: 'repositories',
	initialState,
	reducers: {
		clearRepositories: (state) => {
			console.log('Clearing repositories');
			state.items = [];
			state.status = 'idle';
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepositories.pending, (state) => {
				console.log('Fetching repositories pending');
				state.status = 'loading';
			})
			.addCase(fetchRepositories.fulfilled, (state, action) => {
				console.log('Fetching repositories succeeded');
				state.items = [...state.items, ...action.payload];
				state.status = 'succeeded';
			})
			.addCase(fetchRepositories.rejected, (state, action) => {
				console.error('Fetching repositories failed', action.error.message);
				state.status = 'failed';
				state.error = action.error.message || null;
			});
	},
});

export const { clearRepositories } = repositoriesSlice.actions;

export default repositoriesSlice.reducer;