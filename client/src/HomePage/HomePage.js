import React from "react"
import LastItems from "./LastItems";
import {Container} from "react-bootstrap";
import BiggestCollections from "./BiggestCollections";

export default function HomePage() {
    return (
        <Container className={"py-5"}>
            <LastItems />
            <BiggestCollections />
        </Container>
    )
}