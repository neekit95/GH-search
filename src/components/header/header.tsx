import React, { useState } from 'react';
import styles from './header.module.scss';
import { Button } from '@mui/material';
import { useLoading } from "../../redux/hooks/useLoading.ts";
import { useDispatch } from 'react-redux';
import { fetchRepositories } from '../../redux/slices/repositoriesSlice.ts';
import { AppDispatch } from '../../redux/store/store.ts';

const Header: React.FC<{ onFilterChange: (filter: string) => void }> = ({ onFilterChange }) => {
	const [filter, setFilter] = useState('');
	const { setLoadingState } = useLoading();
	const dispatch = useDispatch<AppDispatch>();

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(event.target.value);
	};

	const executeSearch = async (filter: string) => {
		setLoadingState(true);
		try {
			// Передаем объект с параметрами, включая query, perPage и page
			await dispatch(fetchRepositories({ query: filter })).unwrap();
			onFilterChange(filter);
		} catch (error) {
			const errorMessage = (error as Error).message || 'Ошибка при выполнении запроса';
			console.error("Ошибка при выполнении поиска:", errorMessage);
		} finally {
			setLoadingState(false);
		}
	};

	const handleSearchClick = () => {
		executeSearch(filter);
	};

	const isEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			executeSearch(filter);
		}
	};

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
			>
				Искать
			</Button>
		</div>
	);
};

export default Header;