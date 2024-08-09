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

export interface RepositoriesState {
	items: Repository[];
	total_count: number;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: RepositoriesState = {
	items: [],
	total_count: 0,
	status: 'idle',
};

export const fetchRepositories = createAsyncThunk(
	'repositories/fetchRepositories',
	async ({ query, perPage, page }: { query: string; perPage: number; page: number }) => {
		const response = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=${perPage}&page=${page}`);
		return {
			items: response.data.items.map((repo: any) => ({
				...repo,
				description: repo.description || '',
				license: repo.license?.name || null
			})),
			total_count: response.data.total_count,
		};
	}
);

const repositoriesSlice = createSlice({
	name: 'repositories',
	initialState,
	reducers: {
		clearRepositories(state) {
			state.items = [];
			state.total_count = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepositories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchRepositories.fulfilled, (state, action: PayloadAction<{ items: Repository[]; total_count: number }>) => {
				state.items = action.payload.items;
				state.total_count = action.payload.total_count;
				state.status = 'succeeded';
			})
			.addCase(fetchRepositories.rejected, (state) => {
				state.status = 'failed';
			});
	},
});

export const { clearRepositories } = repositoriesSlice.actions;
export default repositoriesSlice.reducer;