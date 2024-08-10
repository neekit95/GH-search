import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
}

const DataTable: React.FC<DataTableProps> = ({ rows, onRowClick }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Name</TableCell>
					<TableCell>Language</TableCell>
					<TableCell>Forks</TableCell>
					<TableCell>Stars</TableCell>
					<TableCell>Updated</TableCell>
					<TableCell>Description</TableCell>
					<TableCell>License</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow
						key={row.id}
						onClick={() => onRowClick(row.id)}
						selected={row.isChosen}
					>
						<TableCell>{row.name}</TableCell>
						<TableCell>{row.language}</TableCell>
						<TableCell>{row.forks_count}</TableCell>
						<TableCell>{row.stargazers_count}</TableCell>
						<TableCell>{new Date(row.updated_at).toLocaleDateString()}</TableCell>
						<TableCell>{row.description}</TableCell>
						<TableCell>
							{row.license && typeof row.license === 'object' ? row.license.name : row.license || 'No license'}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DataTable;