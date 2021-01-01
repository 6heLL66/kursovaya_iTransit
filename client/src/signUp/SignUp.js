import React, {useState} from "react"
import {Button, Col, Container, Form, Nav, Row} from "react-bootstrap"
import {useRequest} from "../hooks/useRequest.hook"

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { loading, error, request, success } = useRequest()

    async function sendData(e) {
        e.preventDefault()
        try {
            await request(
                "/api/auth/register",
                "POST",
                {
                    email,
                    username,
                    password
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
        <Container className="mt-3">
            <Col lg={{ span: 6, offset: 3 }}>
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

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

                    <Row style={{ color: error ? "red" : "green", marginLeft: 0 }}>
                        <span>{error || success}</span>
                    </Row>

                    <Button variant="primary" type="submit" onClick={sendData} disabled={loading}>
                        Sign Up
                    </Button>

                    <Nav>
                        <Nav.Link href="/signIn" style={{ padding: 0, marginTop: "10px" }}>Sign In</Nav.Link>
                    </Nav>
                </Form>
            </Col>
        </Container>
    )
}