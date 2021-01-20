import React from "react"
import {Col, Row} from "react-bootstrap";

function Comment({ username, message, userId }) {
    return (
        <Col style={{ background: "#ffffff", boxShadow: "0 0 5px rgba(0,0,0,0.3)" }} className={"px-5 py-2 my-3"}>
            <Row><a href={"/collections/" + userId}>{username}</a></Row>
            <Row style={{ color: "#676565" }}>{message}</Row>
        </Col>
    )
}

export default Comment