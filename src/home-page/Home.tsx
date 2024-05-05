import RfsList from "./RfsList";
import {useState} from "react";
import {Box, Button, Modal, Typography} from "@mui/material";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Home() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div>
            <h1>Home</h1>
            <RfsList></RfsList>
            <Button style={{position: "absolute", top: 10, right: 10}} onClick={handleOpen}>Info</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        What is RFS?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        RFS stands for Relative Frequency Shift. Every time a crack appears in the structure, the
                        frequency of the structure changes. This change in frequency, plus some additional calculation,
                        gives the RFS. We use the RFS to predict the location and size of the crack. There are different
                        modes of vibration and we calculate the RFS for each mode. <br/>
                        The error for finding the locations is 0.8967% out of the length of the beam <br/>
                        The error for finding the depths is 1.2338% out of 1/3 of the depth of the beam <br/>
                        The cost of the AI model is a measure of the quality of the prediction. The lower the cost, the
                        better the prediction. <br/>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}

export default Home;