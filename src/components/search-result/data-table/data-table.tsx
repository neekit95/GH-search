import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface DataTableProps {
	rows: {
		id: string;
		name: string;
		language: string;
		forks_count: number;
		stargazers_count: number;
		updated_at: string;
		description: string;
		license: string | null;
		isChosen: boolean;
	}[];
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
					<TableCell>Last Updated</TableCell>
					<TableCell>Description</TableCell>
					<TableCell>License</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<TableRow
						key={row.id}
						onClick={() => onRowClick(row.id)}
						style={{ backgroundColor: row.isChosen ? '#f0f0f0' : 'transparent' }}
					>
						<TableCell>{row.name}</TableCell>
						<TableCell>{row.language}</TableCell>
						<TableCell>{row.forks_count}</TableCell>
						<TableCell>{row.stargazers_count}</TableCell>
						<TableCell>{row.updated_at}</TableCell>
						<TableCell>{row.description}</TableCell>
						<TableCell>{row.license}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default React.memo(DataTable);