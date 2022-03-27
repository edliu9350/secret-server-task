import { useRef, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import useStore from '../store/store';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default ({ open, handleClose }) => {
    const [validationMsg, setValidationMsg] = useState('');
    const [expireAfter, setExpireAfter] = useState('10');
    const textElement = useRef();
    const secrets = useStore(state => state.secrets);
    const setSecrets = useStore(state => state.setSecrets);

    const handleAdd = () => {
        let secretText = textElement.current.value;
        if(secretText == '') {
            setValidationMsg('Secret is empty');
            return;
        } else {
            setValidationMsg('');
        }
        axios.post('/api/secret', {
            secret: secretText,
            expireAfter
        }).then((res) => {
            handleClose();
            let newSecs = [...secrets, res.data.secret];
            setSecrets(newSecs);
        }).catch(err => {
            handleClose();
            alert('Error occured');
        })
    }

    const handleTimeInput = (e) => {
        let num = parseInt(e.target.value);
        if(isNaN(num))
            num = 10;
        e.target.value = num.toString().slice(0, 5);
        setExpireAfter(e.target.value);
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Add a secret
                    </Typography>
                    <textarea 
                        style={{width: '100%', resize: 'none', borderWidth: '2px'}} 
                        rows='10'
                        ref={textElement}
                    >
                    </textarea>
                    <div style={{display: 'flex'}}>
                        <TextField 
                            label="Expire After(min)" 
                            variant="standard" 
                            value={expireAfter}
                            onInput = {handleTimeInput}
                        />
                        <Button 
                            variant="contained" 
                            style={{marginLeft: '15px'}} 
                            sx={{ flexGrow: 1 }}
                            onClick={handleAdd}
                        >
                            Add Secret
                        </Button>
                    </div>
                    <div style={{color: '#aa0000'}}>
                        {validationMsg}
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
}
