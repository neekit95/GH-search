import Container from '@mui/material/Container';
import Header from '../header/header.tsx';
import style from './app.module.scss';
import {useState} from "react";
import SearchResult from "../search-result/search-result.tsx";

const App = () => {
	const [filter, setFilter] = useState('');

	const handleFilterChange = (newFilter: string) => {
		setFilter(newFilter);
	};

	return (
		<>
			<Header onFilterChange={handleFilterChange}/>
			<Container className={style.container}>
				{filter === '' ? 'Добро пожаловать' : <SearchResult/>}
			</Container>
		</>
	);
};

export default App;