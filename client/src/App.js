import './App.css';
import {Redirect, Route, BrowserRouter, Switch} from "react-router-dom";
import SignUpPage from './SignUpPage/SignUpPage'
import SignInPage from "./SignInPage/SignInPage";
import HomePage from "./HomePage/HomePage";
import AdminPage from "./AdminPage/AdminPage"
import Header from "./shared/Header";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import auth from "./shared/auth.js";
import CollectionsPage from "./CollectionsPage/CollectionsPage";
import CollectionPage from "./CollectionPage/CollectionPage";
import ItemPage from "./ItemPage/ItemPage";
import SearchPage from "./Search/SearchPage";


function App() {
    const token = localStorage.getItem("token")
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()

    useEffect(() => {
        if (token) auth(token, dispatch).then()
        else {
            dispatch({ type: "SET_THEME", payload: localStorage.getItem("theme") || "light" })
            dispatch({ type: "SET_LANGUAGE", payload: localStorage.getItem("language") || "rus" })\
        }

        document.body.setAttribute("class", "bg-" + theme)
    }, [token, dispatch, theme])

    const logged = useSelector(state => state.isAuthUser)
    const role = useSelector(state => state.role)

    if (logged) {
       return (
               <BrowserRouter>
                   <Header isLogged={logged} />
                   <Switch>
                       <Route path="/" exact>
                           <HomePage />
                       </Route>
                       <Route path="/collections/:ownerId">
                           <CollectionsPage />
                       </Route>
                       <Route path="/collection/:id">
                           <CollectionPage />
                       </Route>
                       <Route path={"/search/:text?"}>
                           <SearchPage />
                       </Route>
                       <Route path="/item/:id">
                           <ItemPage />
                       </Route>
                       {
                           role === "Admin"
                               ?
                               <Route path="/admin">
                                   <AdminPage />
                               </Route>
                               :
                               []
                       }
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
                            <SignUpPage />
                        </Route>
                        <Route path="/item/:id">
                            <ItemPage />
                        </Route>
                        <Route path="/collections/:ownerId">
                            <CollectionsPage />
                        </Route>
                        <Route path={"/search/:text?"}>
                            <SearchPage />
                        </Route>
                        <Route path="/collection/:id">
                            <CollectionPage />
                        </Route>
                        <Route path="/signIn">
                            <SignInPage />
                        </Route>
                        <Route path="/">
                            <HomePage />
                        </Route>
                        <Redirect to="/signUp" />
                    </Switch>
                </BrowserRouter>
        )
    }
}

export default App;
