import React, {useEffect, useState} from "react"
import {InputGroup, Row} from "react-bootstrap"
import {useDispatch, useSelector} from "react-redux";

function User({ user, index }) {
    const dispatch = useDispatch()
    const [onSelect, setOnSelect] = useState(false)
    const selected = useSelector(state => state.selected)

    function checkBoxHandler(e) {
        if (e.target.checked) {
            dispatch({ type: "SELECT_USER", payload: user })
        }
        else dispatch({ type: "UNSELECT_USER", payload: user })
    }

    function open(e) {
        if (e.target.name !== "checkbox")window.location = "/collections/" + user._id
    }

    useEffect(() => {
        let finded = false
        selected.map(e => {
            if (e === user) {
                finded = true
                setOnSelect(true)
            }
            return null
        })
        if (!finded) setOnSelect(false)
    }, [selected, user])

    return (
        <tr onClick={open}>
            <td className={"d-none d-sm-table-cell"}>{index}</td>
            <td className={"d-none d-md-table-cell"}>{user.email}</td>
            <td>{user.username || user.first_name + " " + user.last_name}</td>
            <td>{user.role}</td>
            <td className={"d-none d-sm-table-cell"}>{user.type}</td>
            <td>{user.status}</td>
            <td className={"px-4"}>
                <Row className="justify-content-center">
                    <InputGroup.Checkbox onChange={checkBoxHandler} checked={onSelect} name={"checkbox"} />
                </Row>
            </td>
        </tr>
    )
}

export default User