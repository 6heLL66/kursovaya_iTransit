import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux";
import {useRequest} from "../hooks/useRequest.hook";
import {Container, Row, Form, Col, Button} from "react-bootstrap";
import Comment from "./Comment";
const languages = require("../languages.json")

function Comments({ itemID }) {
    const lang = useSelector(state => state.language)
    const isAuth = useSelector(state => state.isAuthUser)
    const theme = useSelector(state => state.theme)
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState("")
    const { request } = useRequest()

    useEffect(() => {
        if (itemID) loadComments(true).then()
    }, [itemID])



    async function loadComments(bool) {
        const data = await request(
            "/api/items/getItem",
            "POST",
            {
                id: itemID
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            if (bool) {
                const id = setTimeout(() => {}, 1)
                for (let i = 0; i <= id; i++) clearInterval(i)
                setInterval(loadComments, 3000)
            }
            setComments(data.item.comments)
        }
    }

    async function send() {
        const data = await request(
            "/api/items/createComment",
            "POST",
            {
                token: localStorage.getItem("token"),
                itemId: itemID,
                message
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            setMessage("")
            loadComments().then()
        }
    }
    return (
        <Container className={"mt-4 px-3 py-3 bg-" + (theme === "dark" ? "semi-dark" : "white")
        + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Row className={"w-100 justify-content-center"}>
                <h1>{languages[lang].comments}: </h1>
            </Row>
            {
                comments.length <= 0 ?
                    <Row className={"w-100 justify-content-center mt-3"}>
                        <span style={{ color: "#777171"}}>{languages[lang].commentsMessage}</span>
                    </Row> :
                    comments.map((e, i) => {
                        return <Comment key={i} username={e.username} userId={e.userId} message={e.message} />
                    })
            }
            {
                isAuth ?
                    <Container>
                        <Row className={"mt-5 justify-content-center"}>
                            <Col md={7} xs={9}>
                                <Form.Control
                                    as={"textarea"}
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </Col>
                            <Col xs={1} className={"justify-content-center mt-3"}>
                                <Button variant={"primary"} className={"my-auto"} onClick={send}>{languages[lang].send}</Button>
                            </Col>
                        </Row>
                    </Container> : []
            }
        </Container>
    )
}

export default Comments