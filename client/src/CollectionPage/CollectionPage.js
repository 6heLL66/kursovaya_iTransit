import React, {useEffect, useState} from "react"
import {useParams} from "react-router"
import Info from "./Info";
import {Col, Container, Row} from "react-bootstrap";
import {useRequest} from "../hooks/useRequest.hook";
import ReactLoading from "react-loading";
import ItemsContainer from "./ItemsContainer";

function CollectionPage() {
    const [info, setInfo] = useState(null)

    const [items, setItems] = useState(null)
    const [fields, setFields] = useState([])
    const id = useParams().id
    const { loading, error, request } = useRequest()

    async function loadCollection() {
        const data = await request(
            "/api/collections/getCollection",
            "POST",
            {
                id: id
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            setInfo({
                name: data.collection.name,
                id: data.collection._id,
                description: data.collection.description,
                theme: data.collection.theme,
                ownerId: data.collection.ownerId,
                ownerName: data.collection.ownerName,
                img_id: data.collection.img_id,
                img_format: data.collection.img_format
            })
            setFields(data.collection.advancedFields)
            const items = await request(
                "/api/collections/getItems",
                "POST",
                {
                    id: data.collection._id
                },
                {
                    "Content-Type": "application/json"
                }
            )
            if (items && items.ok) {
                setItems(items.items)
            }
        }

    }

    async function edit(fields) {
        if (fields.file) {
            const formData = new FormData()
            formData.append("file", fields.file)
            const data = await request(
                "/api/files/fileUpload",
                "POST",
                formData
            )
            if (data && data.ok) {
                fields.img_id = data.img_id
                fields.img_format = data.img_format
            }
        }
        const edit = await request(
            "/api/collections/editCollection",
            "POST",
            {
                edit: fields,
                token: localStorage.getItem("token"),
                id,
                ownerId: info.ownerId
            },
            {
                "Content-Type": "application/json"
            }
        )
        if (edit && edit.ok) {
            loadCollection().then()
        }
    }

    useEffect(() => {
        loadCollection().then()
    }, [])
    return (
        <Container fluid>
            {
                loading || !info
                ?
                    <Row className="justify-content-md-center">
                        <ReactLoading type={"spin"} color={"#000000"} height={60} width={60} />
                    </Row>
                :
                    <Col>
                        <Info info={info} loadCollection={loadCollection} id={id} fields={fields} edit={edit} />
                        <ItemsContainer items={items} size={2} isFilter={true} />
                    </Col>
            }
            <span>{error || ""}</span>
        </Container>
    )
}
export default CollectionPage