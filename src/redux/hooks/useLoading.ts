import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';

const useLoading = () => {
	const isLoading = useSelector((state: RootState) => state.loading);
	const dispatch = useDispatch();

	const setLoadingState = (loading: boolean) => {
		dispatch({ type: 'loading/setLoadingState', payload: loading });
	};

	return {
		isLoading,
		setLoadingState,
	};
};

export default useLoading;