import { AppBar, Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate, useLocation } from "react-router-dom";
import SecretAddModal from './secretaddmodal';
import { useState } from 'react';
import axios from "axios";

export default (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    
    const handleBack = () => {
        navigate('/');
    }

    const handleAdd = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDeleteAll = () => {
        if(confirm('Are you sure you want to delete all the secrets?')){
            axios.delete('/api/secrets')
                .then((res) => {
                    navigate('/');
                    alert(res.data.message);
                })
                .catch(err => {
                    alert('Error deleting data');
                })
        }
    }

    return (
        <AppBar position="static">
            <Toolbar variant="dense" style={{height: '64px', backgroundColor: '#00BCD4'}}>
                <div sx={{ mr: 2 }}>
                    <IconButton edge="start" 
                        color="inherit" 
                        aria-label="menu"
                        style={{visibility: location.pathname == '/' ? 'hidden': 'visible'}} 
                        onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </div>
                <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1}}>
                    Secret List
                </Typography>
                <Tooltip title="Add a new secret">
                    <IconButton edge="start" 
                        color="inherit" 
                        aria-label="menu"
                        style={{marginRight: '15px'}}
                        onClick={handleAdd}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete all secrets">
                    <IconButton edge="start" 
                        color="inherit" 
                        aria-label="menu"
                        onClick={handleDeleteAll}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <SecretAddModal open={open} handleClose={handleClose} />
        </AppBar>
    );
}