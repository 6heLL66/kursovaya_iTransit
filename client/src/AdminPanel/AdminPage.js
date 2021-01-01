import React, {useState} from 'react'
import {Button, Col, Container, Form, Nav, Row} from "react-bootstrap";
import {useRequest} from "../hooks/useRequest.hook";

function AdminPage() {
    const [adminName, setAdminName] = useState("")
    const [password, setPassword] = useState("")
    const { request, error, loading } = useRequest()
    const [logged, setLogged] = useState(!!localStorage.getItem("admin"))

    async function sendData(e) {
        e.preventDefault()
        try {
            const data = await request(
                "/api/auth/adminLogin",
                "POST",
                {
                    adminName,
                    password
                },
                {
                    "Content-Type": "application/json"
                }
            )
            if (data) {
                localStorage.setItem("admin", JSON.stringify({...data}))
                setLogged(true)
            }
        } catch(e) {
            throw e
        }
    }

    if (logged) {
        return (
            <h1>asd</h1>
        )
    }
    else {
        return (
            <Container className="mt-3">
                <Col lg={{ span: 6, offset: 3 }}>
                    <Form>
                        <Form.Group controlId="adminname">
                            <Form.Label>Admin name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
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
                    </Form>
                </Col>
            </Container>
        )
    }
}

export default AdminPage