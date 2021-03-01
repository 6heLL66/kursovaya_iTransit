import React, {useCallback, useEffect, useState} from "react"
import {Button, Col, Container, Form, Nav, Row} from "react-bootstrap"
import {useRequest} from "../hooks/useRequest.hook"
import {useDispatch, useSelector} from "react-redux"
import { GoogleLogin } from 'react-google-login'
import auth from "../shared/auth"
const languages = require("../languages.json")

export default function SignInPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { loading, error, request } = useRequest()
    const dispatch = useDispatch()
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

    const login = useCallback(async (type, user) => {
        try {
            const data = await request(
                "/api/auth/login",
                "POST",
                {
                    type,
                    user,
                    lang,
                    theme
                },
                {
                    "Content-Type": "application/json"
                }
            )
            if (data.ok) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("userId", data.user._id)
                localStorage.setItem("type", type)
                await auth(data.token, dispatch)
            } else {
                setPassword("")
            }
        } catch (e) {
            console.log(e.message)
        }
    }, [theme, lang])

    useEffect(() => {
        const views = Array.from(document.getElementById("vk_auth").childNodes)
        console.log(views, theme, lang)
        views.forEach(view => {
            view.remove()
        })
        window.VK.Widgets.Auth('vk_auth', {
            onAuth: (user) => login("vk", user)
        })
    }, [theme, lang])


    return (
        <Container className={"mt-4 py-5" + " bg-" + (theme === "dark" ? "semi-dark" : "white")
        + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Col lg={{ span: 6, offset: 3 }}>
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>{languages[lang].username}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={languages[lang].enterName}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>{languages[lang].password}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={languages[lang].password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Row style={{ color: "red", marginLeft: 0 }}>
                        <span>{error}</span>
                    </Row>

                    <Button
                        variant="primary"
                        type="submit"
                        onClick={() => login("common", { username, password })}
                        disabled={loading}
                    >{languages[lang].signIn}
                    </Button>

                    <Row style={{ marginTop: "10px", marginLeft: 0 }}>
                        <GoogleLogin
                            clientId="808424836478-45hk3q9s4jbhlc9thn8sud56g7ff1u3m.apps.googleusercontent.com"
                            redirectUri={"https://itransitkurs.herokuapp.com/"}
                            onSuccess={(res) => login("google", res.profileObj)}
                            cookiePolicy={'single_host_origin'}
                        />
                    </Row>

                    <Row style={{ marginTop: "10px", marginLeft: 0 }}>
                        <div id="vk_auth"></div>
                    </Row>


                    <Nav>
                        <Nav.Link href="/signUp" style={{ padding: 0, marginTop: "10px" }}>{languages[lang].signUp}</Nav.Link>
                    </Nav>

                </Form>
            </Col>
        </Container>
    )
}