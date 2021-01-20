import React, {useEffect, useState} from "react"
import {Button, Col, Form, Modal, Row} from "react-bootstrap"
import ReactLoading from "react-loading"
import * as Icon from 'react-bootstrap-icons'
import {useSelector} from "react-redux";
const languages = require("../languages.json")

function ChangeFieldsModal({ fields, show, hide, loading, error, edit }) {
    const lang = useSelector(state => state.language)
    const [values, setValues] = useState([])
    const [type, setType] = useState("number")
    const [addError, setAddError] = useState("")

    useEffect(() => {
        console.log(fields)
        setValues(fields)
    }, [fields])

    function formHandler(e, i) {
        let val = [...values]
        val[i].name = e.target.value
        setValues(val)
    }

    function del(i) {
        let val = [...values]
        val.splice(i, 1)
        setValues(val)
    }

    function addField() {
        let val = [...values]
        let count = 1
        val.map((e) => {
            if (e.type === type) count++
            return null
        })
        if (count > 3) {
            setAddError("Максимальное число полей такого типа 3")
            return
        }
        val.push({ type, name: type, new: true })
        setValues(val)
    }

    return (
        <Modal show={show} onHide={hide}>
            <Modal.Header closeButton>
                <Modal.Title>{languages[lang].changeItemFields}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                    <Button
                        onClick={addField}
                        variant={"outline-primary mt-2 mx-auto w-50"}
                    >{languages[lang].addField}</Button>
                </Row>

                <Form.Text>{languages[lang].advancedFields}</Form.Text>
                {
                    values.map((e, i) => {
                        return (
                            <Row key={i} className={"mt-2"}>
                                <Col xs={11}>
                                    <Form.Control type={"text"} onChange={(e) => formHandler(e, i)} value={values[i].name} />
                                </Col>
                                <Col className={"pl-0 py-1"}>
                                    <Icon.XCircle className={"x"} onClick={() => del(i)} style={{ fontSize: "24px" }} />
                                </Col>
                            </Row>
                        )
                    })
                }
            </Modal.Body>
            <Modal.Footer className="container align-items-md-center">
                <Row className={"justify-content-md-center w-100"}>
                    <span className={"my-1"} style={{ color: "red"}}>{error ? error : ""}</span>
                </Row>
                {
                    !loading
                        ?
                        <Row className="justify-content-md-center w-100">
                            <Button variant="outline-success" className={"mx-3"} onClick={() => edit(values)}>
                                {languages[lang].save}
                            </Button>
                            <Button variant="outline-danger" className={"mx-3"} onClick={hide}>
                                {languages[lang].cancel}
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

export default ChangeFieldsModal