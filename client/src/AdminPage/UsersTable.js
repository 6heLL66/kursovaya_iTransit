import React, {useEffect, useState} from "react"
import {Container, InputGroup, Row, Table} from "react-bootstrap"
import User from "./User"
import ReactLoading from "react-loading"
import {useDispatch, useSelector} from "react-redux"
const languages = require("../languages.json")

function UsersTable({ usersData, loading, error }) {
    const [users, setUsers] = useState([])
    const dispatch = useDispatch()
    const selected = useSelector(state => state.selected)
    const lang = useSelector(state => state.language)
    const theme = useSelector(state => state.theme)

    function checkboxHandler(e) {
        if (e.target.checked) {
            dispatch({ type: "SELECT_ALL", payload: usersData })
        }
        else dispatch({ type: "UNSELECT_ALL" })
    }

    useEffect(() => {
        setUsers(usersData.map((e, i) => {
            return <User user={e} index={i} key={i}/>
        }))

    }, [usersData])
    return (
        <Container fluid >
            <Table striped bordered hover variant={theme}>
                <thead>
                <tr>
                    <th className={"d-none d-sm-table-cell "}>#</th>
                    <th className={"d-none d-md-table-cell "}>{languages[lang].email}</th>
                    <th>{languages[lang].username}</th>
                    <th>{languages[lang].role}</th>
                    <th className={"d-none d-sm-table-cell "}>{languages[lang].type}</th>
                    <th>{languages[lang].status}</th>
                    <th>
                        <Row className="justify-content-center">
                            <span className={"d-none d-md-flex"} style={{ marginRight: "10px" }}>{languages[lang].selectAll}</span>
                            <InputGroup.Checkbox
                                checked={usersData.length === selected.length}
                                onChange={checkboxHandler}
                            />
                        </Row>
                    </th>
                </tr>
                </thead>
                <tbody>
                    {users.length <= 0 ? [] : users}
                </tbody>
            </Table>
            { loading ?
                <Row className="justify-content-md-center">
                    <ReactLoading type={"spin"} color={"#000000"} height={60} width={60} />
                </Row>
                : error
            }
        </Container>
    )
}

export default UsersTable