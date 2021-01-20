import React, {useEffect, useState} from "react"
import CollectionsContainer from "../CollectionsPage/CollectionsContainer";
import {useRequest} from "../hooks/useRequest.hook";
import {Container, Row} from "react-bootstrap";
import ReactLoading from "react-loading";

function BiggestCollections() {
    const [collections, setCollections] = useState(null)
    const { request, loading } = useRequest()

    async function loadCollections() {
        const data = await request (
            "/api/collections/getAllCollections",
            "GET"
        )
        if (data && data.ok) {
            const biggestCollections = data.collections.sort((a, b) => {
                return b.items > a.items ? 1 : -1
            }).slice(0, data.collections.length >= 3 ? 3 : data.collections.length)
            setCollections(biggestCollections)
        }
    }

    useEffect(() => {
        loadCollections().then()
    }, [])
    return (
        <Container>
            {
                loading ?
                    <Row className="justify-content-md-center">
                        <ReactLoading type={"spin"} color={"#000000"} height={60} width={60} />
                    </Row>
                    :
                    <CollectionsContainer collections={collections} />
            }
        </Container>

    )
}

export default BiggestCollections