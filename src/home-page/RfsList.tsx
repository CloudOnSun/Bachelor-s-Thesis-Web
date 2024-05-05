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

type OpenState = {
    [key: number]: boolean;
};

function getModeValue(rfs: RFS, modeIndex: number): number | null {
    return rfs[`mode${modeIndex}` as keyof RFS] as number | null;
}

function RfsList() {
    const {logout, user, authenticationToken} = useContext(AuthContext);
    const {allRfs} = useContext(RfsContext);
    const [showAllert, setShowAllert] =
        useState<{ show: boolean, text: string, rfsId: number }>({show: false, text: "", rfsId: -1});
    const navigate = useNavigate();
    const handleLogout = useCallback(async () => {
        logout?.();
        navigate(FrontendRoutes.LOGIN);
    }, [logout, navigate]);

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
            <List>
                {allRfs && allRfs.map((rfs) => (
                    <ListItem key={rfs.id} button>
                        <ListItemText primary={`RFS ID: ${rfs.id}`} secondary={`Created At: ${rfs.createdAt}`}/>
                        <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 12}}>
                            <Button variant="outlined" startIcon={<AddOutlinedIcon/>} onClick={() => {
                                handlePredict(rfs.id).then((response) => {
                                    setShowAllert({show: true, text: response, rfsId: rfs.id});
                                });
                            }}>
                                Predict
                            </Button>
                        </div>
                        {showAllert.show && rfs.id === showAllert.rfsId &&
                            <Alert variant="filled" severity="info" onClose={() =>
                            {setShowAllert({show: false, text: "", rfsId: -1})}}>
                                {showAllert.text}
                            </Alert>
                        }
                        <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 12}}>
                            <Typography variant="body2" onClick={() => handleToggleModes(rfs.id)}
                                        style={{marginRight: 4}}>Modes</Typography>
                            <IconButton onClick={() => handleToggleModes(rfs.id)}>
                                {openModes[rfs.id] ? <ExpandLess/> : <ExpandMore/>}
                            </IconButton>
                        </div>
                        <Collapse in={openModes[rfs.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {Array.from({length: 8}).map((_, index) => (
                                    <ListItem key={index} button>
                                        <ListItemText primary={`Mode ${index + 1}: ${getModeValue(rfs, index + 1)}`}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                            <Typography variant="body2" onClick={() => handleToggleDamages(rfs.id)}
                                        style={{marginRight: 4}}>Predictions</Typography>
                            <IconButton onClick={() => handleToggleDamages(rfs.id)}>
                                {openDamages[rfs.id] ? <ExpandLess/> : <ExpandMore/>}
                            </IconButton>
                        </div>
                        <Collapse in={openDamages[rfs.id]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {rfs.predictedCracks.map((damage) => (
                                    <ListItem key={damage.id} button>
                                        <ListItemText
                                            primary={`Damage at locations (${damage.location1}, ${damage.location2}) with depth (${damage.depth1}, ${damage.depth2}) and cost ${damage.cost}`}/>
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </ListItem>
                ))}
            </List>
            <div className="buttonLogoutContainer">
                <Button variant="outlined" startIcon={<LogoutRounded/>} onClick={handleLogout}>
                    Log Out
                </Button>
            </div>
        </div>
    );
}

export default RfsList