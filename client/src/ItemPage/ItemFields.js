import React, {useEffect, useState} from "react"
import {Button, Col, Container, Row, Form} from "react-bootstrap";
import {useSelector} from "react-redux";
import {useRequest} from "../hooks/useRequest.hook";
import * as Icon from "react-bootstrap-icons"
const languages = require("../languages.json")

function ItemFields({ item, loadItem }) {
    const role = useSelector(state => state.role)
    const userId = useSelector(state => state.userId)
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)
    const [values, setValues] = useState(item.fields)
    const [editMode, setEditMode] = useState(false)
    const { request } = useRequest()

    function formHandler(e, i) {
        let val = [...values]
        val[i].value = e.target.type !== "checkbox" ? e.target.value : e.target.checked
        setValues(val)
    }

    useEffect(() => {
        setValues(item.fields)
    }, [item])

    async function editFields() {
        const data = await request(
            "/api/items/editItemFields",
            "POST",
            {
                token: localStorage.getItem("token"),
                ownerId: item.ownerId,
                id: item._id,
                edit: values
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            loadItem().then()
        }
    }

    return (
        <Container className={"mt-4 px-5 py-3 bg-" + (theme === "dark" ? "semi-dark" : "white")
        + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Row>
                <Col xs={10}>
                    <Row className={"mb-3"}>
                        <h1>{languages[lang].itemInfo}: </h1>
                    </Row>
                    {
                        values ? values.map((e, i) => {
                            if (editMode) {
                                if (e.type === "text") {
                                    return (
                                        <Row key={i}>
                                            <span style={{fontSize: "28px"}} className={"mb-0"}><strong>{e.name}</strong>: </span>
                                            <Form.Control
                                                as={"textarea"}
                                                key={i}
                                                onChange={(e) => formHandler(e, i)}
                                                value={e.value}
                                            />
                                        </Row>
                                    )
                                }
                                else {
                                    return (
                                        <Row key={i} className={"mb-1"}>
                                            <span style={{fontSize: "28px"}}
                                                  className={"mb-0"}><strong>{e.name}</strong>: </span>
                                            <Form.Control
                                                type={e.type}
                                                onChange={(e) => formHandler(e, i)}
                                                value={e.value}
                                                checked={e.value}
                                            />
                                        </Row>
                                    )
                                }
                            } else {
                                return (
                                    <Row className={"mb-3"} key={i}>
                                        <div style={{ display: "flex", "flexDirection": "row", "alignItems": "flex-end" }}>
                                            <span style={{fontSize: "26px"}} className={"mb-0"}><strong>{e.name}</strong>: </span>
                                            <span
                                                style={{fontSize: "26px"}}
                                                className={"ml-2 mb-0"}
                                            >{
                                                e.type !== "checkbox" ? e.value ? e.value : "empty" :
                                                    !e.value ? <Icon.X  style={{ color: "#e22b2b", fontSize: "32px" }}/>
                                                    : <Icon.Check2  style={{ color: "#42b32c", fontSize: "32px" }}/>
                                            }</span>
                                        </div>
                                    </Row>
                                )
                            }
                        }) : []
                    }
                </Col>
                <Col>
                    {
                        role === "Admin" || userId === item.ownerId ?
                            !editMode ?
                            <Button
                                variant={"outline-primary"}
                                onClick={() => setEditMode(true)}
                                style={{ position: "absolute", top: "5px", right: "0" }}
                            >{languages[lang].edit}</Button> :
                            [
                                <Button variant={"outline-success"} onClick={editFields} key={0}>{languages[lang].save}</Button>,
                                <Button
                                    variant={"outline-danger"}
                                    key={1}
                                    onClick={() => setEditMode(false)}
                                >{languages[lang].cancel}</Button>
                            ] : []
                    }

                </Col>
            </Row>
        </Container>
    )
}

export default ItemFields