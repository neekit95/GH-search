import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import style from './data-table.module.scss';

interface RowData {
	id: number; // Идентификатор репозитория
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	isChosen: boolean;
}

interface DataTableProps {
	rows: RowData[];
	onRowClick: (repoId: number) => void; // Передаем идентификатор репозитория
}

const DataTable: React.FC<DataTableProps> = ({ rows, onRowClick }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Название</TableCell>
					<TableCell>Язык</TableCell>
					<TableCell>Число форков</TableCell>
					<TableCell>Число звезд</TableCell>
					<TableCell>Дата Обновления</TableCell>
					{/* <TableCell>Описание</TableCell> */}
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow
						key={row.id} // Используем id в качестве ключа
						className={row.isChosen ? style.chosen : ''}
						onClick={() => onRowClick(row.id)} // Передаем id при клике
					>
						<TableCell>{row.name}</TableCell>
						<TableCell>{row.language}</TableCell>
						<TableCell>{row.forks_count}</TableCell>
						<TableCell>{row.stargazers_count}</TableCell>
						<TableCell>{row.updated_at}</TableCell>
						{/* <TableCell>{row.description}</TableCell> */}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DataTable;