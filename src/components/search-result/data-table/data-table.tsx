import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableSortLabel } from '@mui/material';
import style from './data-table.module.scss';

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

interface DataTableProps {
	rows: RowData[];
	onRowClick: (repoId: string) => void;
	sortBy: string;
	sortDirection: 'asc' | 'desc';
	onSort: (field: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ rows, onRowClick, sortBy, sortDirection, onSort }) => {
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