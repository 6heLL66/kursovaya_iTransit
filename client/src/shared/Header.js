import React, {useState} from 'react'
import {Button, Col, Collapse, Dropdown, Form, Nav, Navbar, Row} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux";
import * as Icon from "react-bootstrap-icons"
import {useRequest} from "../hooks/useRequest.hook";
import {useGoogleLogout} from "react-google-login";
let language = require('../languages.json')

function Header({ isLogged }) {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.userId)
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)
    const [text, setText] = useState("")
    function logout() {
        if (localStorage.getItem("type") === "google") {
            //window.open("https://mail.google.com/mail/u/0/?logout&hl=en", '_blank')
        }
        else if (localStorage.getItem("type") === "VK") {
            window.VK.Auth.logout((res) => {
                console.log(res)
            })
        }
        window.location = "/signIn"
        localStorage.clear()
        dispatch({ type: "LOGOUT_USER" })
    }
    function search() {
        window.location = "/search/" + text
    }
    return (
        <Navbar bg={theme} variant={theme} className={"w-100 bg-" + theme}>
            <Nav className="mr-auto">
                <Nav.Link href="/">{language[lang].header.home}</Nav.Link>
                { isLogged
                    ?
                    [
                        <Nav.Link href={"/collections/" + String(userId)}
                                  key={0}
                        >{language[lang].header.collections}
                        </Nav.Link>,
                        <Nav.Link href="/search/" key={1}>{language[lang].header.search}</Nav.Link>
                    ]
                    :
                    [
                        <Nav.Link href="/search/" key={2}>{language[lang].header.search}</Nav.Link>,
                        <Nav.Link href="/signUp" key={0}>{language[lang].header.signup}</Nav.Link>,
                        <Nav.Link href="/signIn" key={1}>{language[lang].header.signin}</Nav.Link>
                    ]
                }
            </Nav>
            <Col className={"d-none d-md-flex justify-content-end w-100"}>
                <Row>
                    <LanguageChange />
                    <ThemeChange />
                    {
                        isLogged
                            ?
                            <Button variant="outline-danger"
                                    onClick={logout}
                                    className={"mr-md-4"}
                            >{language[lang].header.logout}
                            </Button>
                            :
                            []
                    }
                    <Form inline className={"w-auto"}>
                        <Row className={"d-none d-md-inline"}>
                            <Form.Control
                                type="text"
                                placeholder={language[lang].header.search}
                                className="mr-sm-2"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <Button variant="outline-info" onClick={search}>{language[lang].header.search}</Button>
                        </Row>
                    </Form>
                </Row>
            </Col>
            <BurgerMenu
                logout={logout}
                text={text}
                setText={setText}
                lang={lang}
                isLogged={isLogged}
                search={search}
            />



        </Navbar>
    )
}

function LanguageChange() {
    const language = useSelector(state => state.language)
    const dispatch = useDispatch()
    const { request } = useRequest()

    async function setLanguage(e) {
        e.preventDefault()
        await request(
            "/api/users/setLanguage",
            "POST",
            {
                token: localStorage.getItem("token"),
                language: e.target.innerText
            },
            {
                "Content-Type": "application/json"
            }
        )
        localStorage.setItem("language", e.target.innerText)
        dispatch({ type: "SET_LANGUAGE", payload: e.target.innerText })

    }


    return (
        <Dropdown className={"mr-2"}>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                {language}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={setLanguage}>{ language === "rus" ? "en" : "rus" }</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

function ThemeChange() {
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const { request } = useRequest()

    async function setTheme(e) {
        await request(
            "/api/users/setTheme",
            "POST",
            {
                token: localStorage.getItem("token"),
                theme: e.target.innerText
            },
            {
                "Content-Type": "application/json"
            }
        )
        localStorage.setItem("theme", e.target.innerText)
        dispatch({ type: "SET_THEME", payload: e.target.innerText })
    }


    return (
        <Dropdown className={"mr-md-4 mr-2"}>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                {theme}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={setTheme}>{ theme === "light" ? "dark" : "light" }</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

function BurgerMenu({ isLogged, logout, lang, text, search, setText }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Col className={"d-flex d-md-none justify-content-end"}>
            <Row className={"w-100 justify-content-end"}>
                    <Row className={"w-100 justify-content-end pr-4"}>
                        <Icon.ThreeDots  style={{ fontSize: "28px" }} onClick={() => setIsOpen(!isOpen)}/>
                    </Row>

                    <Collapse in={isOpen}>
                        <Row className={"d-" + (isOpen ? "flex" : "none")}>
                            <Col >
                                <LanguageChange />
                                <ThemeChange />
                                {
                                    isLogged
                                        ?
                                        <Button variant="outline-danger"
                                                onClick={logout}
                                                className={"mr-md-4"}
                                        >{language[lang].header.logout}
                                        </Button>
                                        :
                                        []
                                }
                                <Form inline className={"w-auto"}>
                                    <Row className={"d-none d-md-inline"}>
                                        <Form.Control
                                            type="text"
                                            placeholder={language[lang].header.search}
                                            className="mr-sm-2"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                        <Button variant="outline-info" onClick={search}>{language[lang].header.search}</Button>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Collapse>
            </Row>
        </Col>
    )
}

export default Header
