import './App.css';
import {Redirect, Route, BrowserRouter, Switch} from "react-router-dom";
import SignUp from './signUp/SignUp'
import SignIn from "./signIn/SignIn";
import Home from "./Home/Home";


function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/signUp">
                    <SignUp />
                </Route>
                <Route path="/signcd In">
                    <SignIn />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
                <Redirect to="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default App;
