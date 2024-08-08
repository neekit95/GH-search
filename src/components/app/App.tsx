import Container from '@mui/material/Container';
import Header from '../header/header.tsx';
import style from './app.module.scss';
import {useState} from "react";

const App = () => {
	const [filter, setFilter] = useState('');

	const handleFilterChange = (newFilter: string) => {
		setFilter(newFilter);
	};

	return (
		<>
			<Header onFilterChange={handleFilterChange} />
			<Container className={style.container}>
				{filter}
			</Container>
		</>
	);
};

export default App;