import React, {useEffect, useState} from "react"
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {StyledDropZone} from "react-drop-zone";
import Image from "cloudinary-react/lib/components/Image";
import Transformation from "cloudinary-react/lib/components/Transformation";
import {useSelector} from "react-redux";
import {useRequest} from "../hooks/useRequest.hook";
import * as Icon from "react-bootstrap-icons"
const languages = require("../languages.json")

function Info({ info, loading2, edit }) {
    const role = useSelector(state => state.role)
    const userId = useSelector(state => state.userId)
    const isAuthUser = useSelector(state => state.isAuthUser)
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)
    const [isLiked, setIsLiked] = useState(true)
    const [likesCount, setLikesCount] = useState(0)
    const [editMode, setEditMode] = useState(false)
    const [dropText, setDropText] = useState("Click or drop your file here")
    const [values, setValues] = useState({ name: info.name, file: null})
    const [dropColor, setDropColor] = useState("#888")
    const { request, loading } = useRequest()

    useEffect(() => {
        setValues({ name: info.name, file: null })
        if (info.likes && isAuthUser) {
            setIsLiked(info.likes.includes(userId))
            setLikesCount(info.likes.length)
        }
    }, [info, userId])

    function onDrop(file) {
        const name = file.name.length < 12 ? file.name : file.name.substr(0, 9) + "..."
        setValues({...values, file})
        setDropText("Файл выбран (" + name + ")")
        setDropColor("#74d239")
    }

    async function setLike() {
        if (loading || !isAuthUser) return
        setIsLiked(!isLiked)
        const data = await request (
            "/api/items/likeItem",
            "POST",
            {
                token: localStorage.getItem("token"),
                id: info._id
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            setIsLiked(data.like)
            setLikesCount(likesCount + (data.like ? 1 : -1))
        }
    }

    async function deleteItem() {
        const data = await request(
            "/api/items/deleteItem",
            "POST",
            {
                token: localStorage.getItem("token"),
                id: info._id,
                ownerId: info.ownerId,
                parent: info.parent
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            window.location = "/collection/" + info.parent
        }
    }

    function formHandler(e) {
        setValues({...values, [e.target.name]: e.target.value})
    }

    function tryEdit() {
        const fields = { file: values.file }
        if (values.name !== info.name) fields.name = values.name
        edit(fields)
    }

    return (
        <Container className={"mt-4 py-3 bg-" + (theme === "dark" ? "semi-dark" : "white")
        + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Row>
                <Col xl={4} lg={5} md={6} xs={12} className={"text-center px-lg-2 px-0 text-lg-left"}>
                    {
                        editMode ?
                            <StyledDropZone
                                onMouseEnter={() => {if (dropColor === "#888")setDropColor("#46b2ae")}}
                                onMouseLeave={() => {if (dropColor === "#46b2ae") setDropColor("#888")}}
                                children={dropText}
                                style={{ borderColor: dropColor }}
                                onDrop={onDrop}
                            /> :
                            <Image className={"ml-lg-4"} cloudName="itransit" publicId={info.img_id} format={info.img_format}>
                                <Transformation crop="fill" gravity="faces" width="300" height="200"/>
                            </Image>
                    }
                </Col>
                <Col xl={8} lg={7} md={6} xs={12} className={"text-center text-md-left px-2"}>
                    <Row>
                        <Col lg={7} md={7} xs={12}>
                            {
                                editMode ?
                                    <Form.Control onChange={formHandler} name={"name"} type="text" value={values.name} />
                                    :
                                    <h2 className={"fs-6"}>{info.name}</h2>
                            }
                            <p><strong>{languages[lang].collections.collection}</strong>: <a href={"/collection/" + info.parent}>{info.parentName}</a></p>
                            <Col>
                                <Row className={"justify-content-center"}>
                                    {
                                        isLiked ?
                                            <Icon.HeartFill
                                                style={{
                                                    fontSize: "30px",
                                                    color: "#dd1c1c",
                                                    cursor: "pointer"
                                                }}
                                                onClick={setLike}
                                            /> :
                                            <Icon.Heart
                                                style={{
                                                    fontSize: "30px",
                                                    color: "#dd1c1c",
                                                    cursor: "pointer"
                                                }}
                                                onClick={setLike}
                                            />
                                    }
                                </Row>
                                <Row className={"justify-content-center"}>
                                    <span>{likesCount}</span>
                                </Row>
                            </Col>

                        </Col>
                        <Col style={{
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            {
                                role === "Admin" || userId === info.ownerId ?
                                    editMode ?
                                        [
                                            <Button
                                                variant={"outline-success mb-2 mb-lg-3"}
                                                key={0}
                                                disabled={loading2}
                                                onClick={tryEdit}
                                            >{languages[lang].save}
                                            </Button>,
                                            <Button
                                                variant={"outline-danger my-0 mt-lg-3"}
                                                onClick={() => setEditMode(false)}
                                                disabled={loading2}
                                                key={1}
                                            >{languages[lang].cancel}
                                            </Button>
                                        ] :
                                        [
                                            <Button
                                                variant={"outline-primary mb-2 mt-lg-3"}
                                                onClick={() => setEditMode(true)}
                                                key={2}
                                            >{languages[lang].editItem}
                                            </Button>,
                                            <Button
                                                variant={"outline-danger mb-2 mt-lg-3"}
                                                onClick={deleteItem}
                                                key={3}
                                            >{languages[lang].delete}
                                            </Button>
                                        ]
                                        : []
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Info