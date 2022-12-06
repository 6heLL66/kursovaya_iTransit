import React from "react"
import ReactMarkdown from 'react-markdown'
import {Image, Transformation} from 'cloudinary-react';
import {Button, Card, Col, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
const languages = require("../languages.json")

function Collection({ collection }) {
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

    function openCollection() {
        window.location = "/collection/" + collection._id
    }
    return (
        <Col className={"my-3"} xl={4} md={6} xs={12}>
            <Card
                className={(theme === "dark" ? "text-white-50 bg-dark" : "bg-light")}
                style={{ width: '276px', margin: "auto" }}
            >
                <Image cloudName="itransit" publicId={collection.img_id} format={collection.img_format}>
                    <Transformation crop="fill" gravity="faces" width="276" height="190"/>
                </Image>
                <Card.Body>
                    <Card.Title>{collection.name}</Card.Title>
                    <ReactMarkdown className={"card-text"}>
                        {collection.description}
                    </ReactMarkdown>
                    <Button variant="primary" onClick={openCollection}>{languages[lang].showMore}</Button>
                </Card.Body>
                <Card.Footer>
                    <Row className={"justify-content-center"}>
                        <Card.Text style={{ fontSize: "16px"}}>items: {collection.items}</Card.Text>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>

    )
}

export default Collection