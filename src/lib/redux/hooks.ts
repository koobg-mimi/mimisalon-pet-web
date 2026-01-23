/**
 * Redux 타입 안전 훅
 *
 * TypeScript와 함께 사용하기 위한 타입이 지정된 Redux 훅
 */

import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

/**
 * 타입이 지정된 useDispatch 훅
 *
 * Redux Toolkit의 createAsyncThunk와 함께 사용할 때
 * 자동 완성과 타입 체크를 제공
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/**
 * 타입이 지정된 useSelector 훅
 *
 * RootState에 대한 자동 완성과 타입 체크를 제공
 */
export const useAppSelector = useSelector.withTypes<RootState>()

/**
 * 타입이 지정된 useStore 훅
 *
 * 스토어 인스턴스에 직접 접근할 때 사용
 */
export const useAppStore = useStore.withTypes<AppStore>()
