import React, { useState, useEffect } from 'react';
import style from './search-result.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRepositories } from '../../redux/slices/repositoriesSlice';
import { RootState, AppDispatch } from "../../redux/store/store";
import Loading from "../loading/loading";
import DataTable from "./data-table/data-table";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface Repository {
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
}

interface RowData {
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	isChosen: boolean;
}

const convertToRowData = (repositories: Repository[], chosenRepo: string): RowData[] => {
	return repositories.map(repo => ({
		name: repo.name,
		language: repo.language,
		forks_count: repo.forks_count,
		stargazers_count: repo.stargazers_count,
		updated_at: repo.updated_at,
		description: repo.description,
		isChosen: repo.name === chosenRepo,
	}));
};

const itemsPerPageOptions = [10, 20, 30];

interface SearchResultProps {
	filter: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ filter }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { data: repositories, status } = useSelector((state: RootState) => state.repositories);
	const [paginationCount, setPaginationCount] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedRows, setDisplayedRows] = useState<RowData[]>([]);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [chosenRepo, setChosenRepo] = useState<string>('');

	useEffect(() => {
		if (filter) {
			dispatch(fetchRepositories({ query: filter, perPage: 100, page: 1 }));
		}
	}, [filter, dispatch]);

	useEffect(() => {
		if (repositories.length > 0) {
			const startIndex = (currentPage - 1) * paginationCount;
			const endIndex = startIndex + paginationCount;
			const slicedRepositories = repositories.slice(startIndex, endIndex);
			setDisplayedRows(convertToRowData(slicedRepositories, chosenRepo));

			if (endIndex >= repositories.length && hasMore) {
				const nextPage = Math.ceil(repositories.length / 100) + 1;
				dispatch(fetchRepositories({ query: filter, perPage: 100, page: nextPage }))
					.then((response) => {
						if (response.meta.requestStatus === 'fulfilled') {
							const payload = response.payload as { items: Repository[], total_count: number };
							if (payload.items.length === 0) {
								setHasMore(false);
							}
						}
					});
			}
		}
	}, [repositories, currentPage, paginationCount, dispatch, filter, hasMore, chosenRepo]);

	const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
		const newPaginationCount = Number(event.target.value);
		setPaginationCount(newPaginationCount);
		setCurrentPage(1);
	};

	const handlePageChange = (direction: 'prev' | 'next') => {
		setCurrentPage(prevPage => {
			const totalPages = Math.ceil(repositories.length / paginationCount);
			if (direction === 'prev') {
				return Math.max(prevPage - 1, 1);
			} else {
				return Math.min(prevPage + 1, totalPages);
			}
		});
	};

	const handleRowClick = (repoName: string) => {
		setChosenRepo(prevChosenRepo => prevChosenRepo === repoName ? '' : repoName);
	};

	const chosenRepoDetails = repositories.find(repo => repo.name === chosenRepo);

	return (
		<div className={style.container}>
			{status === 'loading' ? <Loading /> : status === 'failed' ? <div>No gh-token, please refresh page</div> : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						<div className={style.table}>
							{repositories.length === 0 ? 'Ничего не найдено, повторите поиск' : (
								<DataTable
									rows={displayedRows}
									onRowClick={handleRowClick}
								/>
							)}
						</div>
						<div className={style.pagination}>
							<div className={style.paginationRow}>
								<p>Rows per page:</p>
								<Select
									value={paginationCount}
									onChange={handleRowsPerPageChange}
									variant="standard"
									className={style.select}
								>
									{itemsPerPageOptions.map(option => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</Select>
							</div>
							<div className={style.paginationElements}>
								{(currentPage - 1) * paginationCount + 1} - {Math.min(currentPage * paginationCount, repositories.length)} of {repositories.length}
							</div>
							<div className={style.paginationButtons}>
								<button
									disabled={currentPage === 1}
									onClick={() => handlePageChange('prev')}
								>
									&lt;
								</button>
								<button
									disabled={currentPage === Math.ceil(repositories.length / paginationCount) && hasMore}
									onClick={() => handlePageChange('next')}
								>
									&gt;
								</button>
							</div>
						</div>
					</div>
					{repositories.length !== 0 && (
						<div className={style.right}>
							{chosenRepoDetails ? (
								<div className={style.repoDetails}>
									<h2>{chosenRepoDetails.name}</h2>
									<p><strong>Language:</strong> {chosenRepoDetails.language}</p>
									<p><strong>Forks:</strong> {chosenRepoDetails.forks_count}</p>
									<p><strong>Stars:</strong> {chosenRepoDetails.stargazers_count}</p>
									<p><strong>Updated At:</strong> {chosenRepoDetails.updated_at}</p>
									<p><strong>Description:</strong> {chosenRepoDetails.description}</p>
								</div>
							) : (
								<p>Выберите репозиторий для просмотра деталей</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchResult;