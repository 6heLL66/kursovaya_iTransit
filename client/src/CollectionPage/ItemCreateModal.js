import React, {useEffect, useState} from "react"
import {Button, Form, Modal, Row} from "react-bootstrap";
import {StyledDropZone} from "react-drop-zone";
import ReactLoading from "react-loading";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import {useSelector} from "react-redux";
const languages = require("../languages.json")

function ItemCreateModal({ create, loading, error, show, hide, fields }) {
    const lang = useSelector(state => state.language)
    const [dropText, setDropText] = useState(lang === "en" ?
                                            "Click or drop your file here" :
                                            "Нажми или сбрось свой файл сюда")
    const [dropColor, setDropColor] = useState("#888")
    const [item, setItem] = useState({ fields, name: "", tags: [] })
    const [file, setFile] = useState(null)

    useEffect(() => {
        setItem({...item, fields})
    }, [fields])

    function onDrop(file) {
        const name = file.name.length < 12 ? file.name : file.name.substr(0, 9) + "..."
        setDropText((lang === "rus" ? "Файл выбран (" : "File selected (") + name + ")")
        setDropColor("#74d239")
        const formData = new FormData()
        formData.append("file", file)
        setFile(formData)
    }


    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>{languages[lang].createItem}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>{languages[lang].itemName}</Form.Label>
                    <Form.Control
                        type={"text"}
                        onChange={(e) => setItem({...item, name: e.target.value})}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Text className={"mb-2"}>{languages[lang].tags}</Form.Text>
                    <TagsInput value={item.tags} onChange={(tags) => setItem({...item, tags})} addKeys={[9, 13, 32]} />
                </Form.Group>

                <Form.Group>
                    <Form.Text>{languages[lang].advancedFields}</Form.Text>
                    {
                        fields.map((e, i) => {
                            if (e.type === "text") {
                                return [
                                    <Form.Label key={i}>{e.name}</Form.Label>,
                                    <Form.Control
                                        key={i + 1}
                                        as="textarea"
                                        onChange={(e) => {
                                            item.fields[i].value = e.target.value
                                        }}
                                    />
                                ]
                            } else {
                                return [
                                    <Form.Label key={i}>{e.name}</Form.Label>,
                                    <Form.Control
                                        key={i + 1}
                                        type={e.type}
                                        onChange={(e) => {
                                            item.fields[i].value = e.type !== "checkbox"
                                                ? e.target.value :
                                                e.target.checked
                                        }}
                                    />
                                ]
                            }
                        })
                    }
                </Form.Group>
                <Form.Group controlId="image">
                    <Form.Label>{languages[lang].itemImage}</Form.Label>
                    <StyledDropZone
                        onMouseEnter={() => {if (dropColor === "#888")setDropColor("#46b2ae")}}
                        onMouseLeave={() => {if (dropColor === "#46b2ae") setDropColor("#888")}}
                        children={dropText}
                        style={{ borderColor: dropColor }}
                        onDrop={onDrop}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="container align-items-md-center">
                <Row className={"justify-content-md-center w-100"}>
                    <span className={"my-1"} style={{ color: "red"}}>{error ? error : ""}</span>
                </Row>
                {
                    !loading
                        ?
                        <Row className="justify-content-md-center w-100">
                            <Button variant="outline-success" onClick={() => create(item, file)}>
                                {languages[lang].createItem}
                            </Button>
                        </Row>
                        :
                        <Row className="justify-content-md-center w-100">
                            <ReactLoading type={"spin"} color={"#000000"} height={30} width={30} />
                        </Row>
                }
            </Modal.Footer>
        </Modal>
    )
}

export default ItemCreateModal