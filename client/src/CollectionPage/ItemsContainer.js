import React from "react"
import {Container, Row} from "react-bootstrap";
import Item from "./Item";
import {useSelector} from "react-redux";
const languages = require("../languages.json")

function ItemsContainer({ items, size }) {
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

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
            <Row className={"w-100 mt-3 m-auto"}>
                {
                    items && items.length > 0 ? items.map((e, i) => {
                        return <Item item={e} key={i} size={size} />
                    }) :
                        <h5 className={"text-center w-100"}>{languages[lang].emptyMessage}</h5>
                }
            </Row>

        </Container>
    )
}

export default ItemsContainer