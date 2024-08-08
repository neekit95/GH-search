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
}

interface RowData {
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
}

const convertToRowData = (repositories: Repository[]): RowData[] => {
	return repositories.map(repo => ({
		name: repo.name,
		language: repo.language,
		forks_count: repo.forks_count,
		stargazers_count: repo.stargazers_count,
		updated_at: repo.updated_at,
	}));
};

const itemsPerPageOptions = [10, 20, 30, 40, 50];

interface SearchResultProps {
	filter: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ filter }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { data: repositories, status } = useSelector((state: RootState) => state.repositories);
	const [paginationCount, setPaginationCount] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [displayedRows, setDisplayedRows] = useState<RowData[]>([]);

	useEffect(() => {
		if (filter) {
			dispatch(fetchRepositories(filter));
		}
	}, [filter, dispatch]);

	useEffect(() => {
		const startIndex = (currentPage - 1) * paginationCount;
		const endIndex = startIndex + paginationCount;
		const slicedRepositories = repositories.slice(startIndex, endIndex);
		setDisplayedRows(convertToRowData(slicedRepositories));
	}, [repositories, currentPage, paginationCount]);

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

	return (
		<div className={style.container}>
			{status === 'loading' ? <Loading /> : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						<div className={style.table}>
							{repositories.length === 0 ? 'Ничего не найдено, повторите поиск' : (
								<DataTable rows={displayedRows} />
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
									disabled={currentPage === Math.ceil(repositories.length / paginationCount)}
									onClick={() => handlePageChange('next')}
								>
									&gt;
								</button>
							</div>
						</div>
					</div>
					{repositories.length !== 0 && (
						<div className={style.right}>
							Выберите репозиторий
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchResult;