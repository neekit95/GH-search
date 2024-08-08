import React, { useState } from 'react';
import styles from './header.module.scss';
import { Button } from '@mui/material';
import {useLoading} from "../../redux/hooks/useLoading.ts";


const Header: React.FC<{onFilterChange: (filter: string) => void }> = ({ onFilterChange }) => {
	const [filter, setFilter] = useState('');

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	const handleSearchClick = () => {
		setLoadingState(true);
		onFilterChange(filter);
		setTimeout(()=> {
			setLoadingState(false);
		},2000)
	};
	const isEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if(event.key ==='Enter') {
			setLoadingState(true);
			handleSearchClick();
			setTimeout(()=> {
				setLoadingState(false);
			},2000)
		}
	}

	const {setLoadingState} = useLoading()

	return (
		<div className={styles.container}>
			<input
				type="text"
				placeholder="Введите поисковой запрос"
				value={filter}
				onChange={handleFilterChange}
				className={styles.searchInput}
				onKeyDown={isEnter}
			/>

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