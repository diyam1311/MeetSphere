import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {


    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");


    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <>

            <div className="navBar">

                <div style={{ display: "flex", alignItems: "center" }}>

                    <h2>MeetSphere</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Tooltip style={{color:"white"}} title="History">
                        <IconButton onClick={
                            () => {
                                navigate("/history")
                            }
                        }>
                            <RestoreIcon />
                        </IconButton>
                    </Tooltip>

                    <Button
                        startIcon={<LogoutIcon />}
                        sx={{ textTransform: "none", fontWeight: 600, ml: 1 }}
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/auth")
                        }}>
                        Logout
                    </Button>
                </div>


            </div>


            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>Providing quality video calls, just like quality education</h2>

                        <div style={{ display: 'flex', gap: "10px", marginTop: "1.75rem", flexWrap: "wrap" }}>

                            <TextField
                                onChange={e => setMeetingCode(e.target.value)}
                                id="outlined-basic"
                                label="Meeting Code"
                                variant="outlined"
                                sx={{
                                    minWidth: 220,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                        backgroundColor: "rgba(255,255,255,0.04)",
                                        color: "#f3f4f6",
                                        "& fieldset": {
                                            borderColor: "rgba(255,255,255,0.24)",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "rgba(255,255,255,0.4)",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#6366f1",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "#f3f4f6",
                                        caretColor: "#f3f4f6",
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#9aa3b5",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "#818cf8",
                                    },
                                }}
                            />
                            <Button
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                startIcon={<VideoCallIcon />}
                                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, px: 2.5 }}
                            >
                                Join
                            </Button>

                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <img srcSet='/logo3.png' alt="Video call illustration" />
                </div>
            </div>
        </>
    )
}


export default withAuth(HomeComponent)