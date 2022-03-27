import { AppBar, Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import { useNavigate, useLocation } from "react-router-dom";
import SecretAddModal from './secretaddmodal';
import { useState } from 'react';

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
                <IconButton edge="start" 
                    color="inherit" 
                    aria-label="menu"
                    onClick={handleAdd}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </Toolbar>
            <SecretAddModal open={open} handleClose={handleClose} />
        </AppBar>
    );
}