import React, {useState} from "react"
import {Button, Navbar, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import CreateCollectionModal from "./CreateCollectionModal";
import {useRequest} from "../hooks/useRequest.hook";
const language = require("../languages.json")

function ControlPanel({ owner, loadCollections }) {
    const role = useSelector(state => state.role)
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)
    const userId = useSelector(state => state.userId)
    const [showModal, setShowModal] = useState(false)
    const { loading, request, error } = useRequest()

    async function createCollection(form) {
        const formData = new FormData()
        formData.append("file", form.file)
        const data = await request("/api/files/fileUpload", "POST", formData)
        if (data && data.ok) {
            form.img_id = data.img_id
            form.img_format = data.img_format
            form.userId = owner._id
            form.token = localStorage.getItem("token")
            const res = await request(
                "/api/collections/createCollection",
                "POST",
                form,
                {
                    "Content-Type": "application/json"
                }
            )
            if (res && res.ok) {
                setShowModal(false)
                loadCollections().then()
            }
        }
    }

    return(
        <Navbar className={"px-mg-5 px-4 mt-2 justify-content-between "
                + "bg-" + (theme === "dark" ? "semi-dark" : "white")
                + " text-" + (theme === "dark" ? "white-50" : "dark")}>
            <Row>
                <span><strong>{language[lang].collections.owner}</strong>: {owner.username}</span>
            </Row>
            <Row>
                {
                    role === "Admin" || userId === owner._id
                    ?
                    <Button
                        variant={"outline-success"}
                        onClick={() => setShowModal(true)}
                    >{language[lang].collections.create} <span className={"d-none d-sm-inline"}>{language[lang].collections.collection2}</span>
                    </Button>
                    :
                    []
                }
            </Row>
            <CreateCollectionModal
                show={showModal}
                hide={() => setShowModal(false)}
                create={createCollection}
                loading={loading}
                error={error}
            />
        </Navbar>
    )
}

export default ControlPanel