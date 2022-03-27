import { Paper, Divider } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

export default (props) => {
    const locationState = useLocation().state;
    const params = useParams();
    const [secret, setSecret] = useState({});

    useEffect(() => {
        axios.get(`/api/secret/${params.url}`)
            .then(res => {
                setSecret(res.data);
            })
            .catch(err => {
                setSecret({
                    'expiresAt': 'Unavailable',
                    'secretText': JSON.stringify(err)
                })
            })
    }, []);

    return (
        <Paper style={{ padding: 16 }}>
            <article style={{ textAlign: 'left' }}>
                <h1 style={{ margin: 0 }}>{locationState == null ? "Secret" : locationState.title}</h1>
                <div style={{ marginBottom: 10 }}>{secret.expiresAt}</div>
                <Divider variant="outset" />
                <div style={{ wordBreak: 'break-word', marginTop: 10, marginBottom: 10 }}>{secret.secretText}</div>
                <Divider variant="outset" />
            </article>
        </Paper>
    )
}