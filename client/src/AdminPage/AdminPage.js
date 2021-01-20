import React, {useEffect, useState} from 'react'
import UsersTable from "./UsersTable"
import {useRequest} from "../hooks/useRequest.hook"
import {Container} from "react-bootstrap";
import ControlPanel from "./ControlPanel";

function AdminPage() {
    const { loading, request, error } = useRequest()
    const [userData, setUserData] = useState([])

    async function loadUsers() {
        const data = await request("/api/users/getUsers")
        if (data) setUserData(data.data)
    }

    useEffect(() => {
        loadUsers().then()
    }, [])


    return (
        <Container fluid>
            <ControlPanel load={loadUsers} />
            <UsersTable usersData={userData} loading={loading} error={error} />
        </Container>
    )
}



export default AdminPage