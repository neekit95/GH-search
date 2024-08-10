import React, { useState } from 'react';
import Header from '../header/header.tsx';
import style from './app.module.scss';
import SearchResult from '../search-result/search-result.tsx';

/**
 * Главный компонент приложения.
 * @returns {JSX.Element} Компонент App.
 */
const App: React.FC = () => {
	const [filter, setFilter] = useState<string>('');

	/**
	 * Обрабатывает изменение фильтра.
	 * @param newFilter Новый фильтр.
	 */
	const handleFilterChange = (newFilter: string) => {
		setFilter(newFilter);
	};

	return (
		<>
			<Header onFilterChange={handleFilterChange} />
			<div className={style.container}>
				{filter === '' ? (
					<div className={style.hello}>
						Добро пожаловать
					</div>
				) : (
					<SearchResult filter={filter} />
				)}
			</div>
		</>
	);
};

export default App;