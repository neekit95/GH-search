import { useState } from 'react';

/**
 * Хук для управления состоянием загрузки.
 * @returns {object} Объект с состоянием загрузки и функцией для его обновления.
 */
const useLoading = () => {
	const [loading, setLoading] = useState<boolean>(false);

	/**
	 * Устанавливает состояние загрузки.
	 * @param state Значение состояния загрузки.
	 */
	const setLoadingState = (state: boolean) => {
		setLoading(state);
	};

	return { loading, setLoadingState };
};

export default useLoading;