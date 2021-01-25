import React, {useEffect, useState} from "react"
import {Col, Form, Row} from "react-bootstrap"
import {useSelector} from "react-redux";
const language = require("../languages.json")

function SortView({ showedItems, setShowedItems, allItems }) {
    const [fields, setFields] = useState(null)
    const [sort, setSort] = useState({ value: "no" })
    const [itemsCount, setItemsCount] = useState(0)
    const lang = useSelector(state => state.language)

    useEffect(() => {
        if (showedItems && showedItems.length > 0) setFields([...showedItems[0].fields])
    }, [showedItems])

    useEffect(() => {
        if (itemsCount !== showedItems.length) {
            setSort({ value: "no", control: "no" })
            setItemsCount(showedItems.length)
        }
    }, [itemsCount, showedItems])

    useEffect(() => {
        let items = [...showedItems]
        if (!sort ) return
        else if (sort.value === "no")  setShowedItems([...allItems])
        else if (sort.index === undefined) {
            items = items.sort((a, b) => {
                if (sort.value === "ml") {
                    return a.name <= b.name ? -1 : 1
                } else if (sort.value === "lm") return a.name <= b.name ? 1 : -1
                return 1
            })
        } else {
            if (sort.type === "number") {
                items = items.sort((a, b) => {
                    if (sort.value === "ml") {
                        return Number(a.fields[sort.index].value) <= Number(b.fields[sort.index].value) ? 1 : -1
                    } else if (sort.value === "lm") {
                        return Number(a.fields[sort.index].value) <= Number(b.fields[sort.index].value) ? -1 : 1
                    }
                    return 1
                })
            } else if (sort.type === "date") {
                items = items.sort((a, b) => {
                    if (sort.value === "ml") {
                        return (new Date(a.fields[sort.index].value)).getTime()
                                <= (new Date(b.fields[sort.index].value)).getTime() ? 1 : -1
                    } else if (sort.value === "lm") {
                        return (new Date(a.fields[sort.index].value)).getTime()
                                <= (new Date(b.fields[sort.index].value)).getTime() ? -1 : 1
                    }
                    return 1
                })
            }
        }
        setShowedItems([...items])
    }, [sort, allItems])

    return (
        <Row className={"justify-content-end"}>
            <Col>
                <Row>
                    <Form.Text>Сортировка</Form.Text>
                    <Form.Control value={sort.control} as={"select"} onChange={(e) => setSort({
                        value: e.target.value.split(" ")[0],
                        index: e.target.value.split(" ")[1],
                        type: e.target.value.split(" ")[2],
                        control: e.target.value
                    })}>
                        <option value={"no"}>{language[lang].noSort}</option>
                        <option value={"ml"}>{language[lang].nameAZ}</option>
                        <option value={"lm"}>{language[lang].nameZA}</option>
                        {
                            fields && fields.map((e, i) => {
                                if (e.type === "number" || e.type === "date"){ return [
                                    <option
                                        value={"lm " + String(i) + " " + e.type}
                                        key={i}
                                    >{`${e.name} ${language[lang].lessToMore}`}</option>,
                                    <option
                                        value={"ml " + String(i) + " " + e.type}
                                        key={i + 1}
                                    >{`${e.name} ${language[lang].moreToLess}`}</option>
                                ]} else return null
                            })
                        }
                    </Form.Control>
                </Row>
            </Col>
        </Row>
    )
}

export default SortView