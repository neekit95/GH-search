import style from './search-result.module.scss';
import { useLoading } from "../../redux/hooks/useLoading.ts";
import Loading from "../loading/loading.tsx";
import DataTable from "./data-table/data-table.tsx";
import {useState} from "react";

const SearchResult = () => {
	const { isLoading } = useLoading();
	const [startPagination, setStartPagination] = useState(1);
	const [endPagination, setEndPagination] = useState(10);
	const [paginationCount, setPaginationCount] = useState(10);

	function createData(
		name: string,
		language: string,
		forks: number,
		stars: number,
		date: string,
	) {
		return { name, language, forks, stars, date };
	}

	const rows = [
		createData('todo-list', 'JS', 3, 10, '2024-08-01'),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05'),
		createData('my-app', 'Python', 2, 7, '2024-08-10'),
		createData('api-service', 'Go', 8, 20, '2024-08-15'),
		createData('web-scraper', 'Ruby', 6, 12, '2024-08-20'),
		createData('data-visualizer', 'Java', 4, 9, '2024-08-25'),
		createData('auth-system', 'C#', 7, 18, '2024-08-30'),
		createData('todo-list', 'JS', 3, 10, '2024-08-01'),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05'),
		createData('my-app', 'Python', 2, 7, '2024-08-10'),
		createData('api-service', 'Go', 8, 20, '2024-08-15'),
		createData('web-scraper', 'Ruby', 6, 12, '2024-08-20'),
		createData('data-visualizer', 'Java', 4, 9, '2024-08-25'),
		createData('auth-system', 'C#', 7, 18, '2024-08-30'),
		createData('todo-list', 'JS', 3, 10, '2024-08-01'),
		createData('project-x', 'TypeScript', 5, 15, '2024-08-05'),
		createData('my-app', 'Python', 2, 7, '2024-08-10'),
		createData('api-service', 'Go', 8, 20, '2024-08-15'),
		createData('web-scraper', 'Ruby', 6, 12, '2024-08-20'),
		createData('data-visualizer', 'Java', 4, 9, '2024-08-25'),
		createData('auth-system', 'C#', 7, 18, '2024-08-30'),
	];

	return (
		<div className={style.container}>
			{isLoading ? <Loading /> : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						{rows.length === 0 ? 'Ничего не найдено, повторите поиск' : (
							<DataTable rows={rows} />
						)}
						<div className={style.pagination}>
							<div className={style.paginationRow}>
								Rows per page:
								<div>
									{paginationCount}
								</div>
							</div>
						</div>
						<div className={style.paginationElements}>
							{}
						</div>
					</div>
					{rows.length !== 0 ? (
						<div className={style.right}>
							Выберете репозиторий
						</div>
					) : ''}
				</div>
			)}
		</div>
	);
};

export default SearchResult;