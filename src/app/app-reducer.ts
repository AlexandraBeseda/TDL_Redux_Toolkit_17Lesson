import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {Dispatch} from 'redux'
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
}

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        },
    }

});

export const appReducer = slice.reducer;

export const {setAppErrorAC, setAppStatusAC, setIsInitializedAC} = slice.actions;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType,
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null,
    isInitialized: boolean,

}


export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>


//thunk
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        }
    })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
        .finally(() => {
            dispatch(setIsInitializedAC({isInitialized: true}));
        })
}
