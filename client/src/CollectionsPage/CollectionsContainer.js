import React from "react"
import {Container, Row} from "react-bootstrap";
import Collection from "./Collection";
import {useSelector} from "react-redux";
const language = require("../languages.json")

function CollectionsContainer({ collections }) {
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

    return (
        <Container
            style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row"
            }}
            className={"mt-4 py-3" + " bg-" + (theme === "dark" ? "semi-dark" : "white")
                        + " text-" + (theme === "dark" ? "white-50" : "dark")}
            fluid
        >
            <Row className={"w-100 mb-3 justify-content-center mx-auto"}>
                <h1>{language[lang].collections.collections}</h1>
            </Row>
            <Row className={"w-100 mt-3 m-auto"}>
                {
                    collections && collections.length > 0 ?
                        collections.map((e,i) => {
                            return <Collection collection={e} index={i} key={i} />
                        }) :
                        <h5 className={"text-center w-100"}>{language[lang].collections.emptyMessage}</h5>
                }
            </Row>
        </Container>

    )
}

export default CollectionsContainer
