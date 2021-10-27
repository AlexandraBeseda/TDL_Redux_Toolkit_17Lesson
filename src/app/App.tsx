import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useDispatch, useSelector} from 'react-redux'
import {AppRootStateType} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Login} from "../features/Login/Login";
import {Redirect, Route, Switch} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "../features/Login/authReducer";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {

    const dispatch = useDispatch();
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized);
    const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const onClickHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn &&
                    <Button onClick={onClickHandler} color="inherit">Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Switch>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>

                    <Route path={'/404'} render={() => <h1>ERROR 404 NOT FOUND</h1>}/>
                    <Redirect from={"*"} to={"/404"}/>
                </Switch>

            </Container>
        </div>
    )
}

export default App
