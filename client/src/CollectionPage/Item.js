import React from "react"
import Image from "cloudinary-react/lib/components/Image";
import Transformation from "cloudinary-react/lib/components/Transformation";
import {Button, Card, Col, Row} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {useSelector} from "react-redux";
const language = require("../languages.json")

function Item({ item, size }) {
    const theme = useSelector(state => state.theme)
    const lang = useSelector(state => state.language)

    function openItem() {
        window.location = "/item/" + item._id
    }
    return (
        <Col className={"my-3"} xl={size} lg={size + 1} md={4} sm={6} xs={12}>
            <Card
                className={(theme === "dark" ? "text-white-50 bg-dark" : "bg-light")}
                style={{ width: '185px', margin: "auto" }}
            >
                <Image cloudName="itransit" publicId={item.img_id} format={item.img_format}>
                    <Transformation crop="fill" gravity="faces" width="185" height="150"/>
                </Image>
                <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    {
                        item.fields.map((e, i) => {
                            return <Card.Text key={i}><strong>{e.name + ": "}</strong> {
                                e.type !== "checkbox" ? e.value ? e.value : "empty"
                                    : !e.value ? <Icon.X  style={{ color: "#e22b2b", fontSize: "24px" }}/>
                                    : <Icon.Check2  style={{ color: "#42b32c", fontSize: "24px" }}/>
                            }</Card.Text>
                        })
                    }
                    <Button variant="primary" onClick={openItem}>{language[lang].showMore}</Button>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col xs={6} className={"px-0"}>
                            <Card.Text style={{ fontSize: "13px"}}>{language[lang].likes}: {item.likes.length}</Card.Text>
                        </Col>
                        <Col className={"px-0"}>
                            <Card.Text style={{ fontSize: "13px"}}>{language[lang].comments2}: {item.comments.length}</Card.Text>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>
    )
}
export default Item