import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { setLoading } from '../slices/loadingSlice';

export const useLoading = () => {
	const dispatch = useDispatch();
	const isLoading = useSelector((state: RootState) => state.loading.isLoading);

	const setLoadingState = (loading: boolean) => {
		dispatch(setLoading(loading));
	};

	return {
		isLoading,
		setLoadingState,
	};
};