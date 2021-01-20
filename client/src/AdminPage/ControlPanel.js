import React, {useEffect} from "react"
import {Button, ButtonGroup, ButtonToolbar, Container} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useRequest} from "../hooks/useRequest.hook";
const languages = require("../languages.json")

function ControlPanel({ load }) {
    const selected = useSelector(state => state.selected)
    const lang = useSelector(state => state.language)
    const { request, loading } = useRequest()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(selected)
    }, [selected])

    async function control(url) {
        selected.map(async (e) => {
            await request(
                "/api/users/" + url,
                "POST",
                {
                    _id: e._id,
                    type: localStorage.getItem("type"),
                    token: localStorage.getItem("token")
                },
                {
                    "Content-Type": "application/json"
                }
            )
            load()
            dispatch({ type: "UNSELECT_ALL" })
        })
    }

    return (
        <Container fluid style={{ padding: "10px", alignItems: "center", display: "flex" }}>
            <ButtonToolbar aria-label="admin-control-panel">
                <ButtonGroup aria-label="controls-1" className={"mr-5"}>
                    <Button
                        variant="primary"
                        disabled={loading}
                        onClick={() => control("appointAdmin")}
                        className={"mr-2"}
                    >{languages[lang].appointAdmin}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => control("removeAdmin")}
                        disabled={loading}
                        className={"mr-2"}
                    >{languages[lang].removeAdmin}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => control("deleteUser")}
                        disabled={loading}
                    >{languages[lang].delete}
                    </Button>
                </ButtonGroup>
                <ButtonGroup aria-label="controls-2" className={"mt-2 mt-sm-0"}>
                    <Button
                        variant="danger"
                        disabled={loading}
                        className={"mr-2"}
                        onClick={() => control("blockUser")}
                    >{languages[lang].block}
                    </Button>
                    <Button
                        variant="success"
                        disabled={loading}
                        onClick={() => control("unblockUser")}
                    >{languages[lang].unblock}
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>
        </Container>

    )
}

export default ControlPanel