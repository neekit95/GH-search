import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepositories, clearRepositories, Repository } from '../../redux/slices/repositoriesSlice';
import { AppDispatch, RootState } from '../../redux/store/store';
import Loading from '../loading/loading';
import DataTable from './data-table/data-table';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import debounce from 'lodash.debounce';
import style from './search-result.module.scss';

interface License {
	key: string;
	name: string;
	spdx_id: string;
	url: string;
	node_id: string;
}

interface RowData {
	id: string;
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	license: License | string | null;
	isChosen: boolean;
}

const convertToRowData = (repositories: Repository[], chosenRepoId: string): RowData[] => {
	return repositories.map((repo: Repository) => ({
		id: repo.id,
		name: repo.name,
		language: repo.language,
		forks_count: repo.forks_count,
		stargazers_count: repo.stargazers_count,
		updated_at: repo.updated_at,
		description: repo.description,
		license: repo.license,
		isChosen: repo.id === chosenRepoId,
	}));
};

const itemsPerPageOptions = [10, 20, 30];

interface SearchResultProps {
	filter: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ filter }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { items: repositories, status } = useSelector((state: RootState) => state.repositories);
	const [paginationCount, setPaginationCount] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedRows, setDisplayedRows] = useState<RowData[]>([]);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [chosenRepoId, setChosenRepoId] = useState<string>('');

	// Дебаунсинг функции запроса данных
	const fetchRepositoriesDebounced = useCallback(debounce((filter: string, page: number) => {
		dispatch(fetchRepositories({ query: filter, perPage: 100, page }))
			.then((response) => {
				const payload = response.payload as Repository[];
				if (payload.length === 0) {
					setHasMore(false);
				}
			})
			.catch(() => {
				console.log('Error fetching more data');
				setHasMore(false);
			});
	}, 500), [dispatch]);

	useEffect(() => {
		if (filter) {
			dispatch(clearRepositories());
			setPaginationCount(10); // Сброс значения пагинации
			setCurrentPage(1); // Сброс текущей страницы
			setHasMore(true); // Обновление состояния hasMore
			setChosenRepoId(''); // Сброс выбранного репозитория
			fetchRepositoriesDebounced(filter, 1);
		}
	}, [filter, dispatch, fetchRepositoriesDebounced]);

	useEffect(() => {
		if (repositories) {
			const startIndex = (currentPage - 1) * paginationCount;
			const endIndex = startIndex + paginationCount;
			const slicedRepositories = repositories.slice(startIndex, endIndex);
			setDisplayedRows(convertToRowData(slicedRepositories, chosenRepoId));

			if (endIndex >= repositories.length && hasMore) {
				const nextPage = Math.ceil(repositories.length / 100) + 1;
				fetchRepositoriesDebounced(filter, nextPage);
			}
		}
	}, [repositories, currentPage, paginationCount, fetchRepositoriesDebounced, filter, hasMore, chosenRepoId]);

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

	const handleRowClick = (repoId: string) => {
		setChosenRepoId(prevChosenRepoId => prevChosenRepoId === repoId ? '' : repoId);
	};

	const renderLicense = (license: License | string | null) => {
		if (license && typeof license === 'object') {
			return license.name;
		} else if (typeof license === 'string') {
			return license;
		} else {
			return 'No license available';
		}
	};

	const chosenRepoDetails = repositories.find(repo => repo.id === chosenRepoId);

	return (
		<div className={style.container}>
			{status === 'loading' ? (
				<Loading />
			) : status === 'failed' ? (
				<div className={style.nothing}>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</div>
			) : (
				<>
					{repositories.length === 0 ? (
						<div className={style.nothing}>Ничего не найдено, повторите поиск</div>
					) : (
						<div className={style.main}>
							<div className={style.left}>
								<h1>Результаты поиска</h1>
								<div className={style.table}>
									<DataTable
										rows={displayedRows}
										onRowClick={handleRowClick}
									/>
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
											disabled={currentPage === Math.ceil(repositories.length / paginationCount) && !hasMore}
											onClick={() => handlePageChange('next')}
										>
											&gt;
										</button>
									</div>
								</div>
							</div>
							{chosenRepoDetails && (
								<div className={style.right}>
									<h2>{chosenRepoDetails.name}</h2>
									<p><strong>Language:</strong> {chosenRepoDetails.language}</p>
									<p><strong>Forks:</strong> {chosenRepoDetails.forks_count}</p>
									<p><strong>Stars:</strong> {chosenRepoDetails.stargazers_count}</p>
									<p><strong>Last Updated:</strong> {chosenRepoDetails.updated_at}</p>
									<p><strong>Description:</strong> {chosenRepoDetails.description}</p>
									<p><strong>License:</strong> {renderLicense(chosenRepoDetails.license)}</p>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SearchResult;