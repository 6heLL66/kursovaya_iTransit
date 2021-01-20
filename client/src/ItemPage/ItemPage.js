import React, {useEffect, useState} from "react"
import {useParams} from "react-router";
import {useRequest} from "../hooks/useRequest.hook";
import ReactLoading from "react-loading";
import {Container, Row} from "react-bootstrap";
import Info from "./Info";
import ItemFields from "./ItemFields";
import Comments from "./Comments";

function ItemPage() {
    const id = useParams().id
    const {loading, request, error} = useRequest()
    const [item, setItem] = useState({})

    async function loadItem() {
        const data = await request(
            "/api/items/getItem",
            "POST",
            {id},
            {
                "Content-Type": "application/json"
            }
        )
        if (data && data.ok) {
            setItem(data.item)
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
                await request(
                    "/api/items/editItem",
                    "POST",
                    {
                        ownerId: item.ownerId,
                        id: item._id,
                        token: localStorage.getItem("token"),
                        edit: fields
                    },
                    {
                        "Content-Type": "application/json"
                    }
                )
                loadItem().then()
            }
        } else {
            await request(
                "/api/items/editItem",
                "POST",
                {
                    ownerId: item.ownerId,
                    id: item._id,
                    token: localStorage.getItem("token"),
                    edit: fields
                },
                {
                    "Content-Type": "application/json"
                }
            )
            loadItem().then()
        }

    }

    useEffect(() => {
        loadItem().then()
    }, [])


    if (loading) {
        return (
            <Row className="justify-content-md-center">
                <ReactLoading type={"spin"} color={"#000000"} height={60} width={60}/>
            </Row>
        )
    }
    else {
        return (
            <Container>
                <Info loading={loading} edit={edit} error={error} info={item} />
                <ItemFields item={item} loadItem={loadItem} />
                <Comments itemID={item._id}/>
            </Container>
        )

    }
}
export default ItemPage