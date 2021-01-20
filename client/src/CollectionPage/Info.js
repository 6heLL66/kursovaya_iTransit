import React, {useEffect, useState} from "react"
import {Button, Col, Container, Row, Form} from "react-bootstrap"
import Transformation from "cloudinary-react/lib/components/Transformation"
import Image from "cloudinary-react/lib/components/Image"
import ReactMarkdown from "react-markdown"
import ItemCreateModal from "./ItemCreateModal";
import {StyledDropZone} from "react-drop-zone";
import {useRequest} from "../hooks/useRequest.hook";
import {useSelector} from "react-redux";
import ChangeFieldsModal from "./ChangeFieldsModal";
const languages = require("../languages.json")

function Info({ info, loadCollection, fields, id, edit }) {
    const role = useSelector(state => state.role)
    const userId = useSelector(state => state.userId)
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [values, setValues] = useState({ name: info.name, description: info.description, file: null })
    const [dropText, setDropText] = useState("Click or drop your file here")
    const [dropColor, setDropColor] = useState("#888")
    const { request, error, loading } = useRequest()

    useEffect(() => {
        setValues({ name: info.name, description: info.description, file: null })
    }, [info])

    async function deleteCollection() {
        const data = await request(
            "/api/collections/deleteCollection",
            "POST",
            {
                token: localStorage.getItem("token"),
                id: info.id,
                ownerId: info.ownerId
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            window.location = "/collections/" + info.ownerId
        }
    }

    async function createItem(item, file) {
        const loadFile = await request(
            "/api/files/fileUpload",
            "POST",
            file
        )
        if (loadFile && loadFile.ok) {
            const data = await request(
                "/api/collections/createItem",
                "POST",
                {
                    ...item,
                    img_id: loadFile.img_id,
                    img_format: loadFile.img_format,
                    parentName: info.name,
                    token: localStorage.getItem("token"),
                    id: id,
                    ownerId: info.ownerId
                },
                {
                    "Content-Type": "application/json"
                }
            )
            if (data && data.ok) {
                loadCollection().then()
                setShowModal(false)
            }
        }
    }

    function formHandler(e) {
        setValues({...values, [e.target.name]: e.target.value})
    }

    function tryEdit() {
        let fields = {}
        if (values.name !== info.name) fields.name = values.name
        if (values.description !== info.description) fields.description = values.description
        if (values.file) fields.file = values.file
        edit(fields)
    }

    async function editFields(fields) {
        const data = await request (
            "/api/collections/editCollectionFields",
            "POST",
            {
                ownerId: info.ownerId,
                token: localStorage.getItem("token"),
                id: info.id,
                fields
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            loadCollection().then()
            setShowModal2(false)
        }
    }

    function onDrop(file) {
        const name = file.name.length < 12 ? file.name : file.name.substr(0, 9) + "..."
        setValues({...values, file})
        setDropText("Файл выбран (" + name + ")")
        setDropColor("#74d239")
    }

    return (
        <Container className={"mt-4 py-3 bg-" + (theme === "dark" ? "semi-dark" : "white")
        + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Row >
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
                <Col className={"text-center text-md-left px-lg-2 px-0 mr-3 mr-lg-0"}>
                    <Row>
                        <Col lg={7} md={7} xs={12}>
                            {
                                editMode ?
                                        <Form.Control onChange={formHandler} name={"name"} type="text" value={values.name} />
                                        :
                                        <h2 className={"fs-6"}>{info.name}</h2>
                            }
                            <p><strong>{languages[lang].collections.owner}</strong>: <a href={"/collections/" + info.ownerId}>{info.ownerName}</a></p>
                            <p><strong>{languages[lang].theme}</strong>: {info.theme}</p>
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
                                                onClick={tryEdit}
                                                disabled={loading}
                                            >{languages[lang].save}
                                            </Button>,
                                            <Button
                                                variant={"outline-danger my-0 mt-lg-3"}
                                                onClick={() => setEditMode(false)}
                                                disabled={loading}
                                                key={1}
                                            >{languages[lang].cancel}
                                            </Button>
                                        ] :
                                        [
                                            <Button
                                                variant={"outline-success mb-2 mb-lg-3"}
                                                onClick={() => setShowModal(true)}
                                                key={1}
                                            >{languages[lang].createNewItem}
                                            </Button>,
                                            <Button
                                                variant={"outline-primary mb-2 mt-lg-3"}
                                                onClick={() => setEditMode(true)}
                                                key={2}
                                            >{languages[lang].editCollection}
                                            </Button>,
                                            <Button
                                                key={3}
                                                variant={"outline-primary mb-2 mt-lg-3"}
                                                onClick={() => setShowModal2(true)}
                                            >{languages[lang].changeItemFields}
                                            </Button>,
                                            <Button
                                                key={4}
                                                variant={"outline-danger mb-2 mt-lg-3"}
                                                onClick={deleteCollection}
                                            >{languages[lang].delete}
                                            </Button>
                                        ] : []
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                                editMode ?
                                    <Form.Control
                                        onChange={formHandler}
                                        as="textarea" rows={5}
                                        name={"description"}
                                        value={values.description}
                                    />
                                    :
                                    [
                                        <strong key={1}>{languages[lang].descriptionB}: </strong>,
                                        <ReactMarkdown key={2}>
                                            {info.description || "description is absent"}
                                        </ReactMarkdown>
                                    ]
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>

            <ItemCreateModal
                create={createItem}
                fields={fields}
                show={showModal}
                hide={() => setShowModal(false)}
                error={error}
                loading={loading}
            />
            <ChangeFieldsModal
            hide={() => setShowModal2(false)}
            show={showModal2}
            fields={fields}
            error={error}
            loading={loading}
            edit={editFields}
            />
        </Container>
    )
}

export default Info