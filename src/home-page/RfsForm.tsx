import React, {useContext, useState} from 'react';
import {Button, TextField, Input, Typography, FormControl, InputLabel} from '@mui/material';
import {addRfs} from "./home-page-api";
import {AuthContext} from "../auth/AuthProvider";

function FileUploadForm() {
    const {authenticationToken} = useContext(AuthContext);
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);

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

        // Reset form
        setName('');
        setFile(null);
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Upload a file of frequencies to start diagnosing
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <div style={{margin: '20px 0'}}>
                    <TextField
                        label="Nickname of the test"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>
                <div style={{margin: '20px 0'}}>
                    <FormControl fullWidth>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            inputProps={{'aria-label': 'Upload File'}}
                            style={{display: 'block', padding: '10px 0'}}
                        />
                    </FormControl>
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default FileUploadForm;
