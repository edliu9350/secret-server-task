import { List, ListItem, ListItemButton, Divider, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { truncate } from "../utils/utils";
import axios from "axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useStore from '../store/store';

export default (props) => {
    const secrets = useStore(state => state.secrets);
    const setSecrets = useStore(state => state.setSecrets);
    const query = useQuery('secrets', async () => {
        return (await axios.get('/api/secrets')).data;
    }, {
        refetchInterval: 2000,
        refetchOnWindowFocus: true
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (query.data != undefined)
            setSecrets(query.data);
    }, [query.data]);

    const handleSecret = (url, title) => {
        navigate(`/view/${url}`, {
            state: {
                title
            }
        });
    }

    const now = new Date();
    return (
        <Paper style={{ height: '80vh', overflowY: 'auto' }}>
            {secrets.map((secret, index) => (
                <List key={index}>
                    <ListItem>
                        <ListItemButton onClick={() => handleSecret(secret.hash, `Secret ${index + 1}`)}>
                            <article style={{ lineHeight: 1.35, width: '100%' }}>
                                <h2>
                                    <strong>Secret {index + 1}</strong>
                                </h2>
                                <p style={{ wordBreak: 'break-word' }}>
                                    {truncate(secret.secretText, 150)}&hellip;
                                </p>
                                <div style={{ textAlign: 'right', color: '#aa0000' }}>
                                    {now >= new Date(secret.expiresAt) ? 'Expired' : secret.expiresAt}
                                </div>
                            </article>
                        </ListItemButton>
                    </ListItem>
                    <Divider variant="outset" component="li" />
                </List>
            ))}
        </Paper>
    )
}