import React, {useCallback, useEffect, useState} from "react"
import {useRequest} from "../hooks/useRequest.hook";
import ControlPanel from "./ControlPanel";
import {Container, Row} from "react-bootstrap";
import {useParams} from "react-router";
import CollectionsContainer from "./CollectionsContainer";
import ReactLoading from "react-loading";

function CollectionsPage() {
    const ownerId = useParams().ownerId
    const [collections, setCollections] = useState([])
    const [owner, setOwner] = useState({})
    const { request, loading, error } = useRequest()
    const loadUser = useCallback(async () => {
        const data = await request(
            "/api/collections/getCollections",
            "POST",
            { id: ownerId },
            {
                "Content-Type": "application/json"
            }
        )
        if (data) {
            setCollections(data.collections)
            setOwner(data.owner)
        }
    }, [ownerId, request])

    useEffect(() => {
        if (ownerId) loadUser().then()
    }, [ownerId, loadUser])

    return (
        <Container>
            <ControlPanel owner={owner} loadCollections={loadUser} />
            <span style={{ color: "red" }}>{error ? error : ""}</span>
            {
                !loading
                ?
                    <CollectionsContainer collections={collections} />
                :
                    <Row className="justify-content-md-center">
                        <ReactLoading type={"spin"} color={"#000000"} height={60} width={60} />
                    </Row>
            }
        </Container>
    )
}

export default CollectionsPage