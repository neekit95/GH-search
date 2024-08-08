import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Repository {
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
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

export const fetchRepositories = createAsyncThunk(
	'repositories/fetchRepositories',
	async (query: string) => {
		const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
		return response.data.items;
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
			.addCase(fetchRepositories.fulfilled, (state, action: PayloadAction<Repository[]>) => {
				state.status = 'succeeded';
				state.data = action.payload;
			})
			.addCase(fetchRepositories.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message || 'Unknown error';
			});
	},
});

export default repositoriesSlice.reducer;