import React, {useEffect, useState} from "react"
import {Button, Form, Modal, Row} from "react-bootstrap"
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'
import ReactLoading from "react-loading";
import {useSelector} from "react-redux";
const languages = require("../languages.json")

function CreateCollectionModal({ show, hide, create, loading, error }) {
    const lang = useSelector(state => state.language)
    const [dropText, setDropText] = useState(lang === "en" ?
                                                "Click or drop your file here" :
                                                "Нажми или сбрось свой файл сюда")
    const [dropColor, setDropColor] = useState("#888")
    const [type, setType] = useState("number")
    const [addError, setAddError] = useState("")
    const [advancedFields, setAdvancedFields] = useState([])
    const [form, setForm] = useState({
        file: null,
        imgUrl: "",
        name: "",
        theme: "Alcohol",
        description: "",
        advancedFields
    })

    function formHandler(value, field) {
        setForm({...form, [field]: value })
    }

    useEffect(() => {
        setForm({...form, advancedFields})
    }, [advancedFields])

    function onDrop(file) {
        const name = file.name.length < 12 ? file.name : file.name.substr(0, 9) + "..."
        setForm({...form, file })
        setDropText((lang === "rus" ? "Файл выбран (" : "File selected (") + name + ")")
        setDropColor("#74d239")
    }

    function addField() {
        let count = 1
        advancedFields.map((e) => {
            if (e.type === type) count++
            return null
        })
        if (count > 3) {
            setAddError("Максимальное число полей такого типа 3")
            return
        }
        setAdvancedFields([...advancedFields, { type, name: "" }])
        setAddError("")
    }

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>{languages[lang].createCollection}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="collectionName">
                        <Form.Label>{languages[lang].name}</Form.Label>
                        <Form.Control
                            type="text"
                            onChange={(e) => formHandler(e.target.value, "name")}
                            value={form.name}
                            placeholder={languages[lang].enterName}
                        />
                    </Form.Group>

                    <Form.Group controlId="themeSelect">
                        <Form.Label>{languages[lang].theme}</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={(e) => formHandler(e.target.value, "theme")}
                            value={form.theme}
                        >
                            <option value={"Alcohol"}>{languages[lang].alcohol}</option>
                            <option value={"Books"}>{languages[lang].books}</option>
                            <option value={"Coins"}>{languages[lang].coins}</option>
                            <option value={"Anime"}>{languages[lang].anime}</option>
                            <option value={"Films"}>{languages[lang].films}</option>
                            <option value={"Pictures"}>{languages[lang].pictures}</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Text>{languages[lang].addField}</Form.Text>
                        <Form.Control
                            as="select"
                            onChange={(e) => setType(e.target.value)}
                            value={type}
                        >
                            <option value={"number"}>{languages[lang].numberField}</option>
                            <option value={"text"}>{languages[lang].textField}</option>
                            <option value={"date"}>{languages[lang].dateField}</option>
                            <option value={"checkbox"}>{languages[lang].checkboxField}</option>
                            <option value={"input"}>{languages[lang].inlineTextField}</option>
                        </Form.Control>
                        <Row>
                            <p style={{ color: "red", margin: "0 auto" }}>{addError}</p>
                        </Row>
                        <Row>
                            <Button onClick={addField} variant={"outline-primary mt-2 mx-auto w-50"}>{languages[lang].addField}</Button>
                        </Row>

                    </Form.Group>
                    <Form.Group controlId="themeSelect">
                        <Form.Text>{languages[lang].advancedField}</Form.Text>
                        {
                            advancedFields.map((e, i) => {
                                if (e.type === "text") {
                                    return <Form.Control
                                        as="textarea"
                                        placeholder="Enter name of textarea"
                                        onChange={(e) => {
                                            advancedFields[i].name = e.target.value
                                        }}
                                        className={"mt-2"}
                                        key={i}
                                        rows={3}
                                    />
                                }
                                else {
                                    return <Form.Control
                                        type={"input"}
                                        placeholder={"Enter name of " + e.type + " field"}
                                        key={i}
                                        className={"mt-2"}
                                        onChange={(e) => {
                                            advancedFields[i].name = e.target.value
                                        }}
                                    />
                                }
                            })
                        }
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>{languages[lang].collectionImage}</Form.Label>
                        <StyledDropZone
                            onMouseEnter={() => {if (dropColor === "#888")setDropColor("#46b2ae")}}
                            onMouseLeave={() => {if (dropColor === "#46b2ae") setDropColor("#888")}}
                            children={dropText}
                            style={{ borderColor: dropColor }}
                            onDrop={onDrop}
                        />
                    </Form.Group>


                    <Form.Group controlId="description">
                        <Form.Label>{languages[lang].shortDescription}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder={languages[lang].description}
                            onChange={(e) => formHandler(e.target.value, "description")}
                            value={form.description}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="container align-items-md-center">
                <Row className={"justify-content-md-center w-100"}>
                    <span className={"my-1"} style={{ color: "red"}}>{error ? error : ""}</span>
                </Row>
                {
                    !loading
                    ?
                        <Row className="justify-content-md-center w-100">
                            <Button variant="outline-success" onClick={() => create(form)}>
                                {languages[lang].createCollection}
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


export default CreateCollectionModal