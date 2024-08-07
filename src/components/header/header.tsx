import React, { useState } from 'react';
import styles from './header.module.scss';
import { Button } from '@mui/material';

const Header: React.FC<{ onFilterChange: (filter: string) => void }> = ({ onFilterChange }) => {
	const [filter, setFilter] = useState('');

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	const handleSearchClick = () => {
		onFilterChange(filter);
	};

	return (
		<div className={styles.container}>
			<input

				type="text"
				placeholder="Введите поисковой запрос"
				value={filter}
				onChange={handleFilterChange}
				className={styles.searchInput}

			>
			</input>
			<Button
				variant="contained"
				size="medium"
				onClick={handleSearchClick}
				className={styles.searchButton}
				sx={{
					outline: 'none',
					'&:focus': {
						outline: 'none',
					},
					'&:active': {
						outline: 'none',
					}
				}}
			>
				Искать
			</Button>
		</div>
	);
};

export default Header;