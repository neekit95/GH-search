import  { useState, useEffect } from 'react';
import style from './search-result.module.scss';
import { useLoading } from "../../redux/hooks/useLoading.ts";
import Loading from "../loading/loading.tsx";
import DataTable from "./data-table/data-table.tsx";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const itemsPerPageOptions = [10, 20, 30, 40, 50];

function createData(
	name: string,
	language: string,
	forks: number,
	stars: number,
	date: string,
	index: number
) {
	return { name: `${name} ${index}`, language, forks, stars, date, index };
}

const SearchResult = () => {
	const { isLoading } = useLoading();
	const [paginationCount, setPaginationCount] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [displayedRows, setDisplayedRows] = useState<{ name: string; language: string; forks: number; stars: number; date: string; index: number }[]>([]);

	const [rows] = useState([
		createData('todo-list', 'JS', 3, 10, '2024-08-01', 1),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05', 2),
		createData('my-app', 'Python', 2, 7, '2024-08-10', 3),
		createData('todo-list', 'JS', 3, 10, '2024-08-01', 1),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05', 2),
		createData('my-app', 'Python', 2, 7, '2024-08-10', 3),createData('todo-list', 'JS', 3, 10, '2024-08-01', 1),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05', 2),
		createData('my-app', 'Python', 2, 7, '2024-08-10', 3),createData('todo-list', 'JS', 3, 10, '2024-08-01', 1),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05', 2),
		createData('my-app', 'Python', 2, 7, '2024-08-10', 3),createData('todo-list', 'JS', 3, 10, '2024-08-01', 1),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05', 2),
		createData('my-app', 'Python', 2, 7, '2024-08-10', 3),createData('todo-list', 'JS', 3, 10, '2024-08-01', 1),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05', 2),
		createData('my-app', 'Python', 2, 7, '2024-08-10', 3),
		// Добавьте остальные данные с индексами
	]);

	useEffect(() => {
		const startIndex = (currentPage - 1) * paginationCount;
		const endIndex = Math.min(startIndex + paginationCount, rows.length);
		setDisplayedRows(rows.slice(startIndex, endIndex));
	}, [currentPage, paginationCount, rows]);

	const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
		setPaginationCount(Number(event.target.value));
		setCurrentPage(1);
	};

	const handlePageChange = (direction: 'prev' | 'next') => {
		setCurrentPage(prevPage => {
			if (direction === 'prev') {
				return Math.max(prevPage - 1, 1);
			} else {
				return Math.min(prevPage + 1, Math.ceil(rows.length / paginationCount));
			}
		});
	};

	return (
		<div className={style.container}>
			{isLoading ? <Loading /> : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						<div className={style.table}>
							{rows.length === 0 ? 'Ничего не найдено, повторите поиск' : (
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
									sx={{
										backgroundColor: 'transparent',
										boxShadow: 'none',
										'& .MuiSelect-select': {
											borderBottom: 'none',
											padding: "5px 10px"
										},
										'&:before': {
											borderBottom: 'none'
										},
										'&:after': {
											borderBottom: 'none'
										}
									}}
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
								{(currentPage - 1) * paginationCount + 1} - {Math.min(currentPage * paginationCount, rows.length)} of {rows.length}
							</div>
							<div className={style.paginationButtons}>
								<button
									disabled={currentPage === 1}
									onClick={() => handlePageChange('prev')}
								>
									&lt;
								</button>
								{/*<span>Page {currentPage}</span>*/}
								<button
									disabled={currentPage === Math.ceil(rows.length / paginationCount)}
									onClick={() => handlePageChange('next')}
								>
									&gt;
								</button>
							</div>
						</div>
					</div>
					{rows.length !== 0 ? (
						<div className={style.right}>
							Выберите репозиторий
						</div>
					) : ''}
				</div>
			)}
		</div>
	);
};

export default SearchResult;