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

	/**
	 * Обрабатывает изменение значения фильтра в поле ввода.
	 * @param event Событие изменения значения.
	 */
	const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFilter = event.target.value;
		if (newFilter !== filter) {
			console.log(`Filter changed to: ${newFilter}`);
			setFilter(newFilter);
		}
	};

	/**
	 * Выполняет поиск с указанным фильтром.
	 * @param filter Фильтр для поиска.
	 */
	const executeSearch = async (filter: string) => {
		console.log(`Executing search with filter: ${filter}`);
		setLoadingState(true);
		try {
			dispatch(clearRepositories()); // Очищаем репозитории перед новым запросом
			await dispatch(fetchRepositories({ query: filter, perPage: 100, page: 1 })).unwrap();
			onFilterChange(filter);
			console.log(`Search completed for filter: ${filter}`);
		} catch (error) {
			console.error("Error during search execution:", error);
		} finally {
			setLoadingState(false);
		}
	};

	// Обрабатывает клик по кнопке поиска.

	const handleSearchClick = () => {
		if (filter.trim()) { // Проверяем, что фильтр не пустой
			executeSearch(filter);
		} else {
			console.log('Filter is empty, search not executed');
		}
	};

	/**
	 * Обрабатывает нажатие клавиши Enter в поле ввода.
	 * @param event Событие нажатия клавиши.
	 */
	const isEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && filter.trim()) { // Проверяем, что фильтр не пустой
			console.log(`Enter key pressed with filter: ${filter}`);
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