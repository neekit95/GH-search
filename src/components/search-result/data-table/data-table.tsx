import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface RowData {
	name: string;
	language: string;
	forks_count: number;
	stargazers_count: number;
	updated_at: string;
}

interface DataTableProps {
	rows: RowData[];
}

const DataTable: React.FC<DataTableProps> = ({ rows }) => {
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
				{rows.map((row, index) => (
					<TableRow key={index}>
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