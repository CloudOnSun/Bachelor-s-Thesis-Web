import React, {useContext, useState} from 'react';
import {Button, TextField, Input, Typography, FormControl, InputLabel, Alert} from '@mui/material';
import {addRfs} from "./home-page-api";
import {AuthContext} from "../auth/AuthProvider";
import {RfsContext} from "./RfsProvider";
import "./styling/RfsForm.css";

function RfsForm() {
    const {authenticationToken} = useContext(AuthContext);
    const {getRfs} = useContext(RfsContext);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [showAlert, setShowAlert] =
        useState<boolean>(false);

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]); // Capture the first file only
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!file || !name) {
            alert("Please enter a name and select a file.");
            return;
        }

        const response = await addRfs(authenticationToken, name, file);
        console.log(response)
        if (getRfs) {
            getRfs()
        }
        ;

        // Reset form
        setName('');
        setFile(null);
        setShowAlert(true);
    };

    return (
        <div className="file-upload-form-container">
            <Typography variant="h6" gutterBottom className="file-upload-form-title">
                Upload a file with RFS for the first 8 modes to start diagnosing.
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div className="file-upload-form-field">
                    <TextField
                        label="Nickname of the test"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={handleNameChange}
                        className="file-upload-text-field"
                    />
                </div>
                <div className="file-upload-form-field">
                    <FormControl fullWidth>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            inputProps={{'aria-label': 'Upload File'}}
                            className="file-upload-input"
                        />
                    </FormControl>
                </div>
                <Button type="submit" variant="contained" color="primary" className="file-upload-submit-button">
                    Submit
                </Button>
            </form>
            {showAlert &&
                <Alert
                    variant="filled"
                    severity="info"
                    onClose={() => setShowAlert(false)}
                    className="rfs-list-alert"
                >
                    RFS Test added
                </Alert>
            }
        </div>
    );
}

export default RfsForm;
