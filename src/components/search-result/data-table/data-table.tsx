import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import style from './data-table.module.scss';

interface RowData {
	id: string; // добавлен id
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
	description: string;
	license: string | null; // добавлен license
	isChosen: boolean;
}

interface DataTableProps {
	rows: RowData[];
	onRowClick: (repoId: string) => void;
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
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow
						key={row.id} // используем id в качестве ключа
						className={row.isChosen ? style.chosen : ''}
						onClick={() => onRowClick(row.id)}
					>
						<TableCell>{row.name}</TableCell>
						<TableCell>{row.language}</TableCell>
						<TableCell>{row.forks_count}</TableCell>
						<TableCell>{row.stargazers_count}</TableCell>
						<TableCell>{row.updated_at}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DataTable;