import React, {useState} from "react"
import {Button, Col, Container, Form, Nav, Row} from "react-bootstrap";
import {useRequest} from "../hooks/useRequest.hook";
import {useDispatch} from "react-redux";
import auth from "../shared/auth";

export default function SignIn() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { loading, error, request } = useRequest()
    const dispatch = useDispatch()

    async function sendData(e) {
        e.preventDefault()
        try {
            const data = await request(
                "/api/auth/login",
                "POST",
                {
                    username,
                    password
                },
                {
                    "Content-Type": "application/json"
                }
            )
            if (data) {
                localStorage.setItem("token", data.token)
                if (data.token) await auth(data.token, dispatch)
            }
        } catch(e) {
            throw e
        }
    }
    return (
        <Container className="mt-3">
            <Col lg={{ span: 6, offset: 3 }}>
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Row style={{ color: "red", marginLeft: 0 }}>
                        <span>{error}</span>
                    </Row>

                    <Button variant="primary" type="submit" onClick={sendData} disabled={loading}>
                        Sign In
                    </Button>

                    <Nav>
                        <Nav.Link href="/signUp" style={{ padding: 0, marginTop: "10px" }}>Sign Up</Nav.Link>
                    </Nav>
                </Form>
            </Col>
        </Container>
    )
}