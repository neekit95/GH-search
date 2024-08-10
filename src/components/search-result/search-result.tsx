import React, { useEffect, useState } from 'react';
import style from './search-result.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepositories, clearRepositories } from '../../redux/slices/repositoriesSlice';
import { AppDispatch, RootState } from "../../redux/store/store";
import Loading from "../loading/loading";
import DataTable from "./data-table/data-table";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Интерфейс для представления репозитория
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

// Интерфейс для представления данных строки в таблице
interface RowData {
	id: string;
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	license: string | null;
	isChosen: boolean; // Флаг для выделения выбранного репозитория
}

// Функция для преобразования данных репозиториев в формат RowData
const convertToRowData = (repositories: Repository[], chosenRepoId: string): RowData[] => {
	return repositories.map(repo => ({
		id: repo.id,
		name: repo.name,
		language: repo.language,
		forks_count: repo.forks_count,
		stargazers_count: repo.stargazers_count,
		updated_at: repo.updated_at,
		description: repo.description,
		license: repo.license,
		isChosen: repo.id === chosenRepoId, // Проверка, является ли репозиторий выбранным
	}));
};

// Варианты количества элементов на странице
const itemsPerPageOptions = [10, 20, 30];

// Интерфейс для пропсов компонента SearchResult
interface SearchResultProps {
	filter: string; // Фильтр для поиска репозиториев
}

const SearchResult: React.FC<SearchResultProps> = ({ filter }) => {
	const dispatch = useDispatch<AppDispatch>(); // Хук для использования dispatch из Redux
	const { data: repositories, status } = useSelector((state: RootState) => state.repositories); // Получение данных репозиториев и статуса загрузки из состояния Redux
	const [paginationCount, setPaginationCount] = useState<number>(10); // Количество элементов на странице
	const [currentPage, setCurrentPage] = useState<number>(1); // Текущая страница
	const [displayedRows, setDisplayedRows] = useState<RowData[]>([]); // Отображаемые строки таблицы
	const [hasMore, setHasMore] = useState<boolean>(true); // Флаг наличия дополнительных данных для загрузки
	const [chosenRepoId, setChosenRepoId] = useState<string>(''); // ID выбранного репозитория

	// Эффект для выполнения запроса на получение репозиториев при изменении фильтра
	useEffect(() => {
		if (filter) {
			// Очистка текущих данных перед новым запросом
			dispatch(clearRepositories());
			dispatch(fetchRepositories({ query: filter, perPage: 100, page: 1 }));
		}
	}, [filter, dispatch]);

	// Эффект для обработки данных репозиториев и управления пагинацией
	useEffect(() => {
		if (repositories.length > 0) {
			const startIndex = (currentPage - 1) * paginationCount;
			const endIndex = startIndex + paginationCount;
			const slicedRepositories = repositories.slice(startIndex, endIndex); // Срез данных для текущей страницы
			setDisplayedRows(convertToRowData(slicedRepositories, chosenRepoId)); // Преобразование и установка отображаемых строк

			// Если достигнут конец данных, загружаем дополнительные репозитории
			if (endIndex >= repositories.length && hasMore) {
				const nextPage = Math.ceil(repositories.length / 100) + 1; // Определение следующей страницы
				dispatch(fetchRepositories({ query: filter, perPage: 100, page: nextPage }))
					.then((response) => {
						if (response.meta.requestStatus === 'fulfilled') {
							const payload = response.payload as { items: Repository[], total_count: number };
							if (payload.items.length === 0) {
								setHasMore(false); // Устанавливаем флаг, если больше нет данных для загрузки
							}
						}
					});
			}
		}
	}, [repositories, currentPage, paginationCount, dispatch, filter, hasMore, chosenRepoId]);

	// Обработчик изменения количества строк на странице
	const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
		const newPaginationCount = Number(event.target.value);
		setPaginationCount(newPaginationCount);
		setCurrentPage(1); // Сброс текущей страницы на первую
	};

	// Обработчик изменения страницы
	const handlePageChange = (direction: 'prev' | 'next') => {
		setCurrentPage(prevPage => {
			const totalPages = Math.ceil(repositories.length / paginationCount); // Определение общего количества страниц
			if (direction === 'prev') {
				return Math.max(prevPage - 1, 1); // Переход на предыдущую страницу
			} else {
				return Math.min(prevPage + 1, totalPages); // Переход на следующую страницу
			}
		});
	};

	// Обработчик клика по строке таблицы для выбора репозитория
	const handleRowClick = (repoId: string) => {
		setChosenRepoId(prevChosenRepoId => prevChosenRepoId === repoId ? '' : repoId); // Выбор/отмена выбора репозитория
	};

	// Поиск деталей выбранного репозитория
	const chosenRepoDetails = repositories.find(repo => repo.id === chosenRepoId);

	return (
		<div className={style.container}>
			{status === 'loading' ? (
				<Loading /> // Компонент загрузки, если данные находятся в процессе загрузки
			) : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						<div className={style.table}>
							{status === 'failed' ? (
								<div className={style.error}>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</div>
							) : repositories.length === 0 ? (
								'Ничего не найдено, повторите поиск' // Сообщение при отсутствии результатов
							) : (
								<DataTable
									rows={displayedRows}
									onRowClick={handleRowClick} // Передача данных в таблицу и обработчика клика
								/>
							)}
						</div>
						<div className={style.pagination}>
							<div className={style.paginationRow}>
								<p>Rows per page:</p>
								<Select
									value={paginationCount}
									onChange={handleRowsPerPageChange} // Обработчик изменения количества строк на странице
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
								{/* Отображение информации о диапазоне элементов на странице */}
								{((currentPage - 1) * paginationCount) + 1} - {Math.min(currentPage * paginationCount, repositories.length)} of {repositories.length}
							</div>
							<div className={style.paginationButtons}>
								<button
									disabled={currentPage === 1}
									onClick={() => handlePageChange('prev')} // Кнопка для перехода на предыдущую страницу
								>
									&lt;
								</button>
								<button
									disabled={currentPage === Math.ceil(repositories.length / paginationCount) && hasMore}
									onClick={() => handlePageChange('next')} // Кнопка для перехода на следующую страницу
								>
									&gt;
								</button>
							</div>
						</div>
					</div>
					{repositories.length !== 0 && (
						<div className={style.right}>
							{/* Отображение деталей выбранного репозитория */}
							{chosenRepoDetails ? (
								<div className={style.repoDetails}>
									<h2>{chosenRepoDetails.name}</h2>
									<p><strong>Description:</strong> {chosenRepoDetails.description}</p>
									<p><strong>License:</strong> {chosenRepoDetails.license}</p>
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