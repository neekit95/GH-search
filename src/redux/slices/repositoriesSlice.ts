import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
	data: Repository[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: RepositoriesState = {
	data: [],
	status: 'idle',
	error: null,
};

interface FetchRepositoriesParams {
	query: string;
	perPage: number;
	page: number;
}

export const fetchRepositories = createAsyncThunk(
	'repositories/fetchRepositories',
	async ({ query, perPage, page }: FetchRepositoriesParams) => {
		const response = await axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=${perPage}&page=${page}`);
		return {
			items: response.data.items.map((repo: any) => ({
				...repo,
				description: repo.description || '',
				license: repo.license?.name || null
			})),
			total_count: response.data.total_count
		};
	}
);

const repositoriesSlice = createSlice({
	name: 'repositories',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRepositories.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchRepositories.fulfilled, (state, action: PayloadAction<{ items: Repository[], total_count: number }>) => {
				state.status = 'succeeded';
				state.data = [...state.data, ...action.payload.items];
			})
			.addCase(fetchRepositories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Unknown error';
			});
	},
});

export default repositoriesSlice.reducer;