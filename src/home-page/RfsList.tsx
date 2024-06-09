import {useCallback, useContext, useState} from "react";
import {AuthContext} from "../auth/AuthProvider";
import {RfsContext} from "./RfsProvider";
import {useNavigate} from "react-router-dom";
import FrontendRoutes from "../types/FrontendRoutes";
import {Alert, Button, Collapse, IconButton, List, ListItem, ListItemText, Typography} from "@mui/material";
import {ExpandLess, ExpandMore, LogoutRounded} from "@mui/icons-material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {RFS} from "../types/RFS";
import {predictDamage} from "./home-page-api";
import "./styling/RfsList.css";

type OpenState = {
    [key: number]: boolean
};

function getModeValue(rfs: RFS, modeIndex: number): number | null {
    return rfs[`mode${modeIndex}` as keyof RFS] as number | null;
}

function RfsList() {
    const {logout, user, authenticationToken} = useContext(AuthContext);
    const {allRfs} = useContext(RfsContext);
    const [showAlert, setShowAlert] =
        useState<{ show: boolean, text: string, rfsId: number }>({show: false, text: "", rfsId: -1});

    const handlePredict = useCallback(async (rfsId: number) => {
        const response = await predictDamage(authenticationToken, rfsId);
        return response.data.response;
    }, [allRfs, authenticationToken]);

    const [openModes, setOpenModes] = useState<OpenState>({});
    const [openDamages, setOpenDamages] = useState<OpenState>({});

    const handleToggleModes = (id: number) => {
        setOpenModes(prev => ({...prev, [id]: !prev[id]}));
    };

    const handleToggleDamages = (id: number) => {
        setOpenDamages(prev => ({...prev, [id]: !prev[id]}));
    };

    return (
        <div className="rfs-list-container">
            <List className="rfs-list-scrollable">
                {allRfs && allRfs.map((rfs) => (
                    <div key={rfs.id} className="rfs-test-container">
                        <ListItem button className="rfs-list-item">
                            <ListItemText
                                primary={`RFS Test: ${rfs.testName}`}
                                secondary={
                                    <>
                                        {`ID: ${rfs.id}`}<br/>
                                        {`Created At: ${rfs.createdAt}`}
                                    </>
                                }
                                className="rfs-list-item-text"
                            />
                            <Button
                                variant="outlined"
                                startIcon={<AddOutlinedIcon/>}
                                onClick={() => {
                                    handlePredict(rfs.id).then((response) => {
                                        setShowAlert({show: true, text: response, rfsId: rfs.id});
                                    });
                                }}
                                className="rfs-list-predict-button"
                            >
                                Predict
                            </Button>
                        </ListItem>
                        <div className="rfs-list-toggle-container">
                            {showAlert.show && rfs.id === showAlert.rfsId && (
                                <Alert
                                    variant="filled"
                                    severity="info"
                                    onClose={() => setShowAlert({show: false, text: "", rfsId: -1})}
                                    className="rfs-list-alert"
                                >
                                    {showAlert.text}
                                </Alert>
                            )}
                            <div className="rfs-list-toggle-row">
                                <Typography variant="body2" onClick={() => handleToggleModes(rfs.id)} className="rfs-list-toggle-text">
                                    Frequency modes
                                </Typography>
                                <IconButton onClick={() => handleToggleModes(rfs.id)} className="rfs-list-toggle-icon">
                                    {openModes[rfs.id] ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </div>
                            <Collapse in={openModes[rfs.id]} timeout="auto" unmountOnExit className="rfs-list-collapse">
                                <List component="div" disablePadding>
                                    {Array.from({length: 8}).map((_, index) => (
                                        <ListItem key={index} button>
                                            <ListItemText primary={`Mode ${index + 1}: ${getModeValue(rfs, index + 1)}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                            <div className="rfs-list-toggle-row">
                                <Typography variant="body2" onClick={() => handleToggleDamages(rfs.id)} className="rfs-list-toggle-text">
                                    Predictions
                                </Typography>
                                <IconButton onClick={() => handleToggleDamages(rfs.id)} className="rfs-list-toggle-icon">
                                    {openDamages[rfs.id] ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </div>
                            <Collapse in={openDamages[rfs.id]} timeout="auto" unmountOnExit className="rfs-list-collapse">
                                <List component="div" disablePadding>
                                    {rfs.predictedCracks.map((damage) => (
                                        <ListItem key={damage.id} button>
                                            <ListItemText
                                                primary={
                                                    <div className="prediction-details">
                                                        <div className="crack-info">
                                                            {`Crack 1: location ${damage.location1} and depth ${damage.depth1}`}<br/>
                                                            {`Crack 2: location ${damage.location2} and depth ${damage.depth2}`}
                                                        </div>
                                                        <div className="cost-info">
                                                            {`Cost of AI: ${damage.cost}`}
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    </div>
                ))}
            </List>
        </div>
    );
}

export default RfsList