import style from './search-result.module.scss';
import {useLoading} from "../../redux/hooks/useLoading.ts";
import Loading from "../loading/loading.tsx";

const SearchResult = () => {
	const {isLoading} = useLoading()

	return (
		<div className={style.container}>
			{isLoading ? <Loading/> : (
				<div className={style.main}>
					<div className={style.left}>
						<h1>Результаты поиска</h1>
						<table>
							<thead>
							<tr>
								<th>Заголовок 1</th>
								<th>Заголовок 2</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<td>1</td>
								<td>2</td>
							</tr>
							<tr>
								<td>3</td>
								<td>4</td>
							</tr>
							</tbody>
						</table>
					</div>
					<div className={style.right}>
						Выберете репозиторий
					</div>
				</div>
			)}


		</div>
	);
};

export default SearchResult;

