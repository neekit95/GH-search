import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import style from './data-table.module.scss';

// Типизация строки данных таблицы
interface RowData {
	name: string;
	language: string;
	forks: number;
	stars: number;
	date: string;
}

// Типизация пропсов для DataTable
interface DataTableProps {
	rows: RowData[];
}

const DataTable: React.FC<DataTableProps> = ({ rows }) => {
	return (
		<TableContainer component={Paper} className={style.tableContainer}>
			<Table className={style.table} aria-label="simple table">
				<TableHead className={style.tableHead}>
					<TableRow>
						<TableCell className={style.tableCell}>Название</TableCell>
						<TableCell align="right" className={style.tableCell}>Язык</TableCell>
						<TableCell align="right" className={style.tableCell}>Число форков</TableCell>
						<TableCell align="right" className={style.tableCell}>Число звезд</TableCell>
						<TableCell align="right" className={style.tableCell}>Дата Обновления</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.name} className={style.tableRow}>
							<TableCell component="th" scope="row" className={style.tableCell}>
								{row.name}
							</TableCell>
							<TableCell align="right" className={style.tableCell}>{row.language}</TableCell>
							<TableCell align="right" className={style.tableCell}>{row.forks}</TableCell>
							<TableCell align="right" className={style.tableCell}>{row.stars}</TableCell>
							<TableCell align="right" className={style.tableCell}>{row.date}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default DataTable;