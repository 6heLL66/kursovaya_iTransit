import './App.css';
import {Redirect, Route, BrowserRouter, Switch} from "react-router-dom";
import SignUp from './SignUp/SignUp'
import SignIn from "./SignIn/SignIn";
import Home from "./Home/Home";
import AdminPage from "./AdminPanel/AdminPage"
import Header from "./shared/Header";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import auth from "./shared/auth.js";


function App() {
    const token = localStorage.getItem("token")
    const dispatch = useDispatch()
    useEffect(() => {
        if (token) auth(token, dispatch)
    }, [])
    const logged = useSelector((state) => state.isAuthUser)

    if (logged) {
       return (
               <BrowserRouter>
                   <Header isLogged={logged} />
                   <Switch>
                       <Route path="/" exact>
                           <Home />
                       </Route>
                       <Route path="/admin" exact>
                           <AdminPage />
                       </Route>
                       <Redirect to="/" />
                   </Switch>
               </BrowserRouter>
       )
    }
    else {
        return(
                <BrowserRouter>
                    <Header isLogged={logged} />
                    <Switch>
                        <Route path="/signUp">
                            <SignUp />
                        </Route>
                        <Route path="/admin">
                            <AdminPage />
                        </Route>
                        <Route path="/signIn">
                            <SignIn />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                        <Redirect to="/signUp" />
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default App;
