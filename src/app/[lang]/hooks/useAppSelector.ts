
import { RootState } from '@/modules/store';
import { TypedUseSelectorHook, useSelector } from 'react-redux';


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;