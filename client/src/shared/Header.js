import React from 'react'
import {Button, Form, FormControl, Nav, Navbar} from "react-bootstrap"
import * as Icon from 'react-bootstrap-icons'
import {useDispatch} from "react-redux";

function Header({ isLogged }) {
    const dispatch = useDispatch()
    function logout() {
        localStorage.removeItem("token")
        dispatch({ type: "LOGOUT_USER" })
    }
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">FQ</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                { isLogged
                    ?
                    [
                        <Nav.Link href="/collections" key={0}>Your Collections</Nav.Link>,
                        <Nav.Link href="/search" key={1}>Search</Nav.Link>
                    ]
                    :
                    <Nav.Link href="/signUp">Sign Up</Nav.Link>
                }
            </Nav>
            <Form inline>
                {
                    isLogged
                        ?
                        <Button variant="outline-danger"
                                onClick={logout}
                                style={{ marginRight: "20px" }}
                        >Logout
                        </Button>
                        :
                        []
                }
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-info">Search</Button>
            </Form>
        </Navbar>
    )
}

export default Header
