import React, {useEffect, useState} from "react"
import {Button, Col, Form, Row} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons"
import {useSelector} from "react-redux";
const language = require("../languages.json")

function FilterView({ allItems, setShowedItems }) {
    const [field, setField] = useState({})
    const [filterType, setFilterType] = useState("")
    const [value, setValue] = useState(null)
    const [filters, setFilters] = useState([])
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

    useEffect(() => {
        setField({ type: allItems[0].fields[0].type, name: allItems[0].fields[0].name, index: 0 })
        setFilterType(allItems[0].fields[0].type === "checkbox" ? "true" : "more")
    }, [allItems])

    useEffect(() => {
        if (field.type === "checkbox") setFilterType("true")
        else setFilterType("more")
    }, [field])

    useEffect(() => {
        let items = [...allItems]
        filters.forEach(filter => {
            items = items.filter(item => {
                if (filter.type === "number") {
                    return filter.filterType === "less"
                        ? Number(item.fields[filter.index].value) < filter.value
                        : Number(item.fields[filter.index].value) > filter.value
                } else if (filter.type === "date") {
                    return filter.filterType === "less"
                        ? (new Date(item.fields[filter.index].value)).getTime() < (new Date(filter.value)).getTime()
                        : (new Date(item.fields[filter.index].value)).getTime() > (new Date(filter.value)).getTime()
                } else if (filter.type === "checkbox") {
                    return filter.filterType === "true"
                        ? item.fields[filter.index].value === true
                        : item.fields[filter.index].value === false
                }
                return true
            })
        })
        setShowedItems([...items])
    }, [filters, allItems, setShowedItems])

    function addFilter () {
        if (value === null && field.type !== "checkbox") return
        let add = false
        setFilters(filters.map(e => {
            if (e.name !== field.name) return e
            else {
                add = true
                return {
                    type: field.type,
                    name: field.name,
                    filterType: filterType,
                    value: value,
                    index: field.index
                }
            }
        }))
        if (!add) {
            setFilters([...filters, {
                type: field.type,
                name: field.name,
                filterType: filterType,
                value: value,
                index: field.index
            }])
        }
    }

    function deleteFilter(ind) {
        setFilters(filters.filter((e, i) => {
            return ind !== i
        }))
    }


    return (
        <Row>
            <Col xs={12}>
                <Row>
                    <Col xs={6} md={2}>
                        <Row>
                            <Form.Text>{language[lang].filter}</Form.Text>
                            <Form.Control
                                as={"select"}
                                onChange={(e) => setField({
                                    type: e.target.value.split(" ")[0],
                                    name: e.target.value.split(" ")[1],
                                    index: Number(e.target.value.split(" ")[2]),
                                    control: e.target.value
                                })}
                                value={field.control}
                            >
                                {
                                    allItems && allItems[0].fields.map((e, i) => {
                                        if (e.type !== "text" && e.type !== "input") {
                                            return <option
                                                key={i}
                                                value={e.type + " " + e.name + " " + String(i)}
                                            >{e.name}</option>
                                        }
                                        return null
                                    })
                                }
                            </Form.Control>
                        </Row>
                    </Col>
                    <Col className={"mx-md-2"} xs={6} md={3}>
                        <Row>
                            <Form.Text>{language[lang].filterType}</Form.Text>
                            <Form.Control as={"select"} onChange={(e) => setFilterType(e.target.value)}>
                                {
                                    field ?
                                        field.type === "number" || field.type === "date" ?
                                            [
                                                <option
                                                    value={"more"}
                                                    key={0}
                                                >{language[lang].moreThen}</option>,
                                                <option
                                                    value={"less"}
                                                    key={1}
                                                >{language[lang].lessThen}</option>
                                            ] :
                                            field.type === "checkbox" ?
                                                [
                                                    <option
                                                        value={"true"}
                                                        key={2}
                                                    >{language[lang].onlyOn}</option>,
                                                    <option
                                                        value={"false"}
                                                        key={3}
                                                    >{language[lang].onlyOff}</option>
                                                ] :
                                                []
                                        :
                                        []
                                }
                            </Form.Control>
                        </Row>
                    </Col>
                    {
                        field.type !== "checkbox" ?
                            <Col xs={6} md={3}>
                                <Row>
                                    <Form.Text>{ filterType === "more" ? language[lang].more : language[lang].less}</Form.Text>
                                    <Form.Control type={field.type} onChange={e => setValue(e.target.value)} />
                                </Row>

                            </Col> :
                            []
                    }
                    <Col xs={6} md={3} className={"d-flex align-items-end px-3"}>
                        <Button onClick={addFilter} variant={"outline-primary"}>{language[lang].addFilter}</Button>
                    </Col>
                </Row>
            </Col>
            <Col md={12} className={"mt-2"}>
                <Row>
                    <Col>
                        {
                            filters && filters.map((e, i) => {
                                return (
                                    <Row
                                        className={"p-2 w-md-75 my-1 justify-content-between " + (theme === "dark" ? "bg-dark" : "bg-light")}
                                        key={i}
                                    >
                                        <span
                                        >{
                                            e.type !== "checkbox"
                                                ?
                                                `${e.name} filter ${e.filterType} then ${e.value && e.value}`
                                                :
                                                `${e.name} filter only ${e.filterType}`
                                        }</span>
                                        <Icon.XCircle onClick={() => deleteFilter(i)} className={"x"} />
                                    </Row>
                                )
                            })
                        }
                    </Col>

                </Row>
            </Col>
        </Row>

    )
}

export default FilterView