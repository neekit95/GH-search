import style from './loading.module.scss';

const Loading = () => {
	return (
		<div className={style.container}>
			<div className={style.spinnerBox}>
				<div className={style.circleBorder}>
					<div className={style.circleCore}></div>
				</div>
			</div>
		</div>
	);
};

export default Loading;