import Header from '../header/header.tsx';
import style from './app.module.scss';
import { useState } from "react";
import SearchResult from "../search-result/search-result.tsx";

const App = () => {
	const [filter, setFilter] = useState('');

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