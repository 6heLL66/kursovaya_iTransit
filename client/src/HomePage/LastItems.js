import React, {useEffect, useState} from "react"
import ItemsContainer from "../CollectionPage/ItemsContainer";
import {useRequest} from "../hooks/useRequest.hook";
import ReactLoading from "react-loading";
import {Container, Row} from "react-bootstrap";

function LastItems() {
    const [items, setItems] = useState(null)
    const { request, loading } = useRequest()

    async function loadItems() {
        const data = await request(
            "/api/collections/getAllItems",
            "GET"
        )
        if (data && data.ok) {
            setItems(data.items.slice(data.items.length - 7 > 0 && data.items.length - 7))
        }
    }

    useEffect(() => {
        loadItems().then()
    }, [])

    return (
        <Container>
            {
                loading && items
                    ?
                    <Row className="justify-content-md-center">
                        <ReactLoading type={"spin"} color={"#000000"} height={60} width={60} />
                    </Row>
                    :
                    <ItemsContainer items={items} size={3} />
            }
        </Container>
    )
}

export default LastItems