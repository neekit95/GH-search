import React, { useState } from 'react';
import styles from './header.module.scss';
import { Button } from '@mui/material';
import useLoading from "../../redux/hooks/useLoading.ts";
import { useDispatch } from 'react-redux';
import { fetchRepositories, clearRepositories } from '../../redux/slices/repositoriesSlice.ts';
import { AppDispatch } from '../../redux/store/store.ts';

const Header: React.FC<{ onFilterChange: (filter: string) => void }> = ({ onFilterChange }) => {
	const [filter, setFilter] = useState('');
	const { setLoadingState } = useLoading();
	const dispatch = useDispatch<AppDispatch>();

	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFilter = event.target.value;
		if (newFilter !== filter) {
			setFilter(newFilter);
		}
	};

	const executeSearch = async (filter: string) => {
		setLoadingState(true);
		try {
			dispatch(clearRepositories()); // Очищаем репозитории перед новым запросом
			await dispatch(fetchRepositories({ query: filter, perPage: 100, page: 1 })).unwrap();
			onFilterChange(filter);
		} catch (error) {
			console.error("Ошибка при выполнении поиска:", error);
		} finally {
			setLoadingState(false);
		}
	};

	const handleSearchClick = () => {
		if (filter.trim()) { // Проверяем, что фильтр не пустой
			executeSearch(filter);
		}
	};

	const isEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && filter.trim()) { // Проверяем, что фильтр не пустой
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