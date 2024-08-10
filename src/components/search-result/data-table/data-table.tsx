import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableSortLabel } from '@mui/material';
import style from './data-table.module.scss';

export interface License {
	// Ключ лицензии.
	key: string;

	// Название лицензии.
	name: string;

	// Идентификатор лицензии в формате SPDX.
	spdx_id: string;

	// URL лицензии.
	url: string;

	// Идентификатор узла лицензии.
	node_id: string;

}

interface RowData {
	// Уникальный идентификатор репозитория.
	id: string;

	// Название репозитория.
	name: string;

	// Язык программирования, используемый в репозитории.
	language: string;

	// Количество форков репозитория.
	forks_count: number;

	// Количество звезд репозитория.
	stargazers_count: number;

	// Дата последнего обновления репозитория.
	updated_at: string;

	// Описание репозитория.
	description: string;

	// Лицензия репозитория, может быть объектом License, строкой или null.
	license: License | string | null;

	// Флаг, указывающий, выбран ли репозиторий.
	isChosen: boolean;
}

interface DataTableProps {
	// Массив данных для строк таблицы.
	rows: RowData[];

	// Обработчик клика по строке таблицы.
	// @param repoId Уникальный идентификатор репозитория.
	onRowClick: (repoId: string) => void;

	// Поле, по которому производится сортировка.
	sortBy: string;

	// Направление сортировки ('asc' для возрастания, 'desc' для убывания).
	sortDirection: 'asc' | 'desc';

	// Обработчик изменения сортировки.
	// @param field Поле, по которому производится сортировка.
	onSort: (field: string) => void;
}

/**
 * Компонент таблицы для отображения данных о репозиториях.
 * @param rows Массив данных для строк таблицы.
 * @param onRowClick Обработчик клика по строке таблицы.
 * @param sortBy Поле, по которому производится сортировка.
 * @param sortDirection Направление сортировки.
 * @param onSort Обработчик изменения сортировки.
 * @returns JSX.Element
 */
const DataTable: React.FC<DataTableProps> = ({ rows, onRowClick, sortBy, sortDirection, onSort }) => {
	// Обрабатывает клик по заголовку таблицы для изменения сортировки.
	// @param field Поле, по которому производится сортировка.
	const handleSort = (field: string) => {
		onSort(field);
	};

	return (
		<Table className={style.table}>
			<TableHead>
				<TableRow className={style.tableHead}>
					<TableCell className={style.tableCell}>
						<TableSortLabel
							active={sortBy === 'name'}
							direction={sortDirection}
							onClick={() => handleSort('name')}
						>
							Имя
						</TableSortLabel>
					</TableCell>
					<TableCell className={style.tableCell}>Язык</TableCell>
					<TableCell className={style.tableCell}>
						<TableSortLabel
							active={sortBy === 'forks_count'}
							direction={sortDirection}
							onClick={() => handleSort('forks_count')}
						>
							Число форков
						</TableSortLabel>
					</TableCell>
					<TableCell className={style.tableCell}>
						<TableSortLabel
							active={sortBy === 'stargazers_count'}
							direction={sortDirection}
							onClick={() => handleSort('stargazers_count')}
						>
							Число звезд
						</TableSortLabel>
					</TableCell>
					<TableCell className={style.tableCell}>
						<TableSortLabel
							active={sortBy === 'updated_at'}
							direction={sortDirection}
							onClick={() => handleSort('updated_at')}
						>
							Дата обновления
						</TableSortLabel>
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow
						key={row.id}
						onClick={() => onRowClick(row.id)}
						className={`${style.tableRow} ${row.isChosen ? style.chosen : ''}`}
					>
						<TableCell className={style.tableCell}>{row.name}</TableCell>
						<TableCell className={style.tableCell}>{row.language}</TableCell>
						<TableCell className={style.tableCell}>{row.forks_count}</TableCell>
						<TableCell className={style.tableCell}>{row.stargazers_count}</TableCell>
						<TableCell className={style.tableCell}>{new Date(row.updated_at).toLocaleDateString()}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DataTable;