import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepositories, clearRepositories, Repository } from '../../redux/slices/repositoriesSlice';
import { AppDispatch, RootState } from '../../redux/store/store';
import DataTable from './data-table/data-table';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import debounce from 'lodash.debounce';
import style from './search-result.module.scss';

interface RowData {
	id: string;
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	license: string | null;
	isChosen: boolean;
}

const itemsPerPageOptions = [10, 20, 30];

interface SearchResultProps {
	filter: string;
}

/**
 * Преобразует массив репозиториев в формат данных для строки таблицы.
 * @param repositories Массив репозиториев.
 * @param chosenRepoId ID выбранного репозитория.
 * @returns Массив данных для строк таблицы.
 */
const convertToRowData = (repositories: Repository[], chosenRepoId: string): RowData[] => {
	return repositories.map((repo: Repository) => ({
		id: repo.id,
		name: repo.name,
		language: repo.language,
		forks_count: repo.forks_count,
		stargazers_count: repo.stargazers_count,
		updated_at: repo.updated_at,
		description: repo.description,
		license: repo.license ? repo.license.name : null,
		isChosen: repo.id === chosenRepoId,
	}));
};

/**
 * Компонент для отображения результатов поиска с пагинацией и сортировкой.
 * @param filter Фильтр для поиска репозиториев.
 * @returns JSX.Element
 */
const SearchResult: React.FC<SearchResultProps> = ({ filter }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { items: repositories } = useSelector((state: RootState) => state.repositories);
	const [paginationCount, setPaginationCount] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [chosenRepoId, setChosenRepoId] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [noResults, setNoResults] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<string>('stargazers_count');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

	/**
	 * Дебаунс-функция для получения репозиториев с задержкой.
	 * @param filter Фильтр для поиска репозиториев.
	 * @param page Номер страницы для получения данных.
	 */
	const fetchRepositoriesDebounced = useCallback(debounce((filter: string, page: number) => {
		setLoading(true);
		setNoResults(false);
		dispatch(fetchRepositories({ query: filter, perPage: 100, page }))
			.unwrap()
			.then((payload: Repository[]) => {
				if (payload.length === 0) {
					setNoResults(true);
					setHasMore(false);
				} else {
					setHasMore(true);
					setNoResults(false);
				}
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
				setError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
				setHasMore(false);
				setNoResults(false);
			});
	}, 500), [dispatch]);

	useEffect(() => {
		if (filter) {
			dispatch(clearRepositories());
			setPaginationCount(10);
			setCurrentPage(1);
			setHasMore(true);
			setChosenRepoId('');
			setLoading(true);
			fetchRepositoriesDebounced(filter, 1);
		}
	}, [filter, dispatch, fetchRepositoriesDebounced]);

	/**
	 * Сортирует репозитории по выбранному полю и направлению сортировки.
	 * @returns Отсортированный массив репозиториев.
	 */
	const sortedRepositories = useMemo(() => {
		return [...repositories].sort((a, b) => {
			const aValue = a[sortBy as keyof Repository] ?? '';
			const bValue = b[sortBy as keyof Repository] ?? '';
			if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	}, [repositories, sortBy, sortDirection]);

	/**
	 * Определяет данные для отображения на текущей странице.
	 * @returns Массив данных для строк таблицы.
	 */
	const displayedRows = useMemo(() => {
		if (sortedRepositories.length > 0) {
			const startIndex = (currentPage - 1) * paginationCount;
			const endIndex = startIndex + paginationCount;
			const slicedRepositories = sortedRepositories.slice(startIndex, endIndex);
			return convertToRowData(slicedRepositories, chosenRepoId);
		}
		return [];
	}, [sortedRepositories, currentPage, paginationCount, chosenRepoId]);

	/**
	 * Вычисляет общее количество страниц.
	 * @returns Общее количество страниц.
	 */
	const totalPages = useMemo(() => Math.ceil(repositories.length / paginationCount), [repositories.length, paginationCount]);

	useEffect(() => {
		if (repositories.length > 0 && !loading && !error) {
			const startIndex = (currentPage - 1) * paginationCount;
			const endIndex = startIndex + paginationCount;
			if (endIndex >= repositories.length && hasMore) {
				const nextPage = Math.ceil(repositories.length / 100) + 1;
				fetchRepositoriesDebounced(filter, nextPage);
			}
		}
	}, [repositories, currentPage, paginationCount, fetchRepositoriesDebounced, filter, hasMore, loading, error]);

	/**
	 * Обрабатывает изменение количества строк на странице.
	 * @param event Событие изменения значения.
	 */
	const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
		const newPaginationCount = Number(event.target.value);
		setPaginationCount(newPaginationCount);
		setCurrentPage(1);  // Сбрасываем текущую страницу на первую
	};

	/**
	 * Обрабатывает изменение текущей страницы.
	 * @param direction Направление изменения страницы ('prev' или 'next').
	 */
	const handlePageChange = (direction: 'prev' | 'next') => {
		if (direction === 'prev' && currentPage > 1) {
			setCurrentPage(prevPage => prevPage - 1);
		} else if (direction === 'next' && currentPage < totalPages && !loading) {
			setCurrentPage(prevPage => prevPage + 1);
		}
	};

	/**
	 * Обрабатывает нажатие на строку таблицы.
	 * @param repoId ID репозитория.
	 */
	const handleRowClick = (repoId: string) => {
		setChosenRepoId(prevChosenRepoId => prevChosenRepoId === repoId ? '' : repoId);
	};

	/**
	 * Обрабатывает изменение сортировки по полю.
	 * @param field Поле для сортировки.
	 */
	const handleSort = (field: string) => {
		const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
		setSortBy(field);
		setSortDirection(newDirection);
		setCurrentPage(1);  // Сбрасываем текущую страницу на первую при изменении сортировки
	};

	const chosenRepoDetails = useMemo(() => repositories.find(repo => repo.id === chosenRepoId), [repositories, chosenRepoId]);

	return (
		<div className={style.container}>
			{error ? (
				<div className={style.nothing}>{error}</div>
			) : noResults ? (
				<div className={style.nothing}>Ничего не найдено, повторите поиск</div>
			) : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						<div className={style.table}>
							<DataTable
								rows={displayedRows}
								onRowClick={handleRowClick}
								sortBy={sortBy}
								sortDirection={sortDirection}
								onSort={handleSort}
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
								{(currentPage - 1) * paginationCount + 1} - {Math.min(currentPage * paginationCount, repositories.length)} из {repositories.length}
							</div>
							<div className={style.paginationButtons}>
								<button
									onClick={() => handlePageChange('prev')}
									disabled={currentPage === 1 || loading}
								>
									&laquo;
								</button>
								<button
									onClick={() => handlePageChange('next')}
									disabled={!hasMore || loading}
								>
									&raquo;
								</button>
							</div>
						</div>
					</div>
					{chosenRepoDetails && (
						<div className={style.right}>
							<h2>Подробности о репозитории</h2>
							<p><strong>Описание:</strong> {chosenRepoDetails.description || 'Нет описания'}</p>
							<p><strong>Лицензия:</strong> {chosenRepoDetails.license ? chosenRepoDetails.license.name : 'Не указана'}</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchResult;