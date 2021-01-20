import React, {useState} from "react"
import {Button, Col, Container, Form, Nav, Row} from "react-bootstrap"
import {useRequest} from "../hooks/useRequest.hook"
import {useSelector} from "react-redux";
const languages = require("../languages.json")

export default function SignUpPage() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { loading, error, request, success } = useRequest()
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

    async function sendData(e) {
        e.preventDefault()
        try {
            await request(
                "/api/auth/register",
                "POST",
                {
                    email,
                    username,
                    password,
                    role: "User"
                },
                {
                    "Content-Type": "application/json"
                }
            )
            if (error === null) {
                setEmail("")
                setUsername("")
                setPassword("")
            }
        } catch(e) {
            throw e
        }

    }
    return (
        <Container className={"mt-4 py-5" + " bg-" + (theme === "dark" ? "semi-dark" : "white")
        + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Col lg={{ span: 6, offset: 3 }}>
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>{languages[lang].email}</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

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

                    <Row style={{ color: error ? "red" : "green", marginLeft: 0 }}>
                        <span>{error || success}</span>
                    </Row>

                    <Button variant="primary" type="submit" onClick={sendData} disabled={loading}>
                        {languages[lang].signUp}
                    </Button>

                    <Nav>
                        <Nav.Link href="/signIn" style={{ padding: 0, marginTop: "10px" }}>{languages[lang].signIn}</Nav.Link>
                    </Nav>
                </Form>
            </Col>
        </Container>
    )
}