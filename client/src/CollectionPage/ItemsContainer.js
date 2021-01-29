import React, {useEffect, useState} from "react"
import {Col, Container, Row} from "react-bootstrap";
import Item from "./Item";
import {useSelector} from "react-redux";
import FilterView from "./FilterView";
import SortView from "./SortView";
const languages = require("../languages.json")

function ItemsContainer({ items, size, isFilter }) {
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)
    const [allItems, setAllItems] = useState(items)
    const [showedItems, setShowedItems] = useState(items)

    useEffect(() => {
        setAllItems(items)
        setShowedItems(items)
    }, [items])

    return (
        <Container
            style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row"
            }}
            className={"mt-4 py-3 bg-" + (theme === "dark" ? "semi-dark" : "white")
            + " text-" + (theme === "dark" ? "white-50" : "dark")}
            fluid
        >
            <Row className={"w-100 justify-content-center mb-3 mx-auto"}>
                <h1>{languages[lang].items}</h1>
            </Row>
            {
                allItems && allItems.length > 0 && isFilter && allItems[0].fields.length > 0 ?
                    <Row className={"w-100 justify-content-between mx-auto mb-3"}>
                        <Col xs={12} md={9}>
                            <FilterView allItems={allItems} setShowedItems={setShowedItems} />
                        </Col>
                        <Col xs={12} md={3}>
                            <SortView allItems={allItems} showedItems={showedItems} setShowedItems={setShowedItems} />
                        </Col>
                    </Row> :
                    []
            }
            <Row className={"w-100 mt-3 m-auto"}>
                {
                    showedItems && showedItems.length > 0 ? showedItems.map((e, i) => {
                        return <Item item={e} key={i} size={size} />
                    }) :
                        <h5 className={"text-center w-100"}>{languages[lang].emptyMessage}</h5>
                }
            </Row>

        </Container>
    )
}

export default ItemsContainer