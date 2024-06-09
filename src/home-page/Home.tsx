import RfsList from "./RfsList";
import {useCallback, useContext, useState} from "react";
import {Box, Button, Modal, Typography} from "@mui/material";
import RfsForm from "./RfsForm";
import "./styling/Home.css";
import {LogoutRounded} from "@mui/icons-material";
import FrontendRoutes from "../types/FrontendRoutes";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../auth/AuthProvider";

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
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);
    const handleLogout = useCallback(async () => {
        logout?.();
        navigate(FrontendRoutes.LOGIN);
    }, [logout, navigate]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div className="home-container">
            <Typography variant="h3" align="center" gutterBottom className="home-title">
                Beam Damage Detector
            </Typography>
            <RfsForm/>
            <RfsList />
            <Button style={{position: "absolute", top: 10, right: 10}} onClick={handleOpen} className="home-info-button">
                Info
            </Button>
            <div className="rfs-list-logout-container">
                <Button variant="outlined" startIcon={<LogoutRounded/>} onClick={handleLogout}
                        className="rfs-list-logout-button">
                    Log Out
                </Button>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-box">
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