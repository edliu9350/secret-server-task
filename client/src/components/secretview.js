import { Paper, Divider } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getTimeString } from "../utils/utils";

export default (props) => {
    const locationState = useLocation().state;
    const params = useParams();
    const [secret, setSecret] = useState({
        expiresAt: "",
        secretText: ""
    });
    const [remainTime, setRemainTime] = useState(0);

    useEffect(() => {
        const interval = null;
        axios.get(`/api/secret/${params.url}`)
            .then(res => {
                setSecret(res.data);
                setRemainTime(new Date(res.data.expiresAt) - new Date());
                interval = setInterval(() => {
                    setRemainTime(remainTime => remainTime - 1000);
                }, 1000);
            })
            .catch(err => {
                if(err.response){
                    const expiredAt = new Date(err.response.data.expiredAt);
                    setSecret({
                        'expiresAt': expiredAt,
                        'secretText': 'Expired'
                    });
                    setRemainTime(expiredAt - new Date());
                }
            })
    }, []);

    return (
        <Paper style={{ padding: 16 }}>
            <article style={{ textAlign: 'left' }}>
                <h1 style={{ margin: 0 }}>{locationState == null ? "Secret" : locationState.title}</h1>
                <div style={{ marginBottom: 10 }}>{String(secret.expiresAt)}</div>
                { remainTime != 0 && <div style={{ marginBottom: 10 }}>{
                    remainTime > 0 ? 
                        'remains: ' + getTimeString(remainTime) : 
                        'expired: ' + getTimeString(-remainTime) + ' ago'}
                </div> }
                <Divider variant="outset" />
                <div style={{ wordBreak: 'break-word', marginTop: 10, marginBottom: 10 }}>
                    {remainTime >= 0 ? secret.secretText : 'Expired'}
                </div>
                <Divider variant="outset" />
            </article>
        </Paper>
    )
}