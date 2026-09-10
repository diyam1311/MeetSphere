import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import VideocamIcon from '@mui/icons-material/Videocam';
import EventNoteIcon from '@mui/icons-material/EventNote';

import { IconButton, Tooltip } from '@mui/material';
export default function History() {


    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([])


    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // IMPLEMENT SNACKBAR
            }
        }

        fetchHistory();
    }, [])

    let formatDate = (dateString) => {

        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`

    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'radial-gradient(50% 40% at 90% 0%, rgba(99,102,241,0.14), transparent 60%), #0b0f19',
            color: '#f3f4f6',
            fontFamily: '"Inter", sans-serif',
        }}>

            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: { xs: 2, sm: 4 }, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
                <Tooltip title="Back to home">
                    <IconButton sx={{ color: '#f3f4f6', bgcolor: 'rgba(255,255,255,0.06)' }} onClick={() => {
                        routeTo("/home")
                    }}>
                        <HomeIcon />
                    </IconButton >
                </Tooltip>
                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif' }}>
                    Meeting history
                </Typography>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 2,
                p: { xs: 2, sm: 4 },
            }}>
                {
                    (meetings.length !== 0) ? meetings.map((e, i) => {
                        return (

                            <Card key={i} variant="outlined" sx={{
                                bgcolor: '#141a2b',
                                borderColor: 'rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                transition: 'transform 0.15s ease, border-color 0.15s ease',
                                '&:hover': { transform: 'translateY(-3px)', borderColor: 'rgba(99,102,241,0.4)' },
                            }}>

                                <CardContent>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 40, height: 40, borderRadius: '10px',
                                        bgcolor: 'rgba(99,102,241,0.15)', color: '#818cf8', mb: 1.5,
                                    }}>
                                        <VideocamIcon fontSize="small" />
                                    </Box>

                                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6' }} gutterBottom>
                                        Code: {e.meetingCode}
                                    </Typography>

                                    <Typography sx={{
                                        display: 'flex', alignItems: 'center', gap: 0.6,
                                        fontSize: 13.5, color: '#9aa3b5',
                                    }}>
                                        <EventNoteIcon sx={{ fontSize: 16 }} />
                                        {formatDate(e.date)}
                                    </Typography>

                                </CardContent>

                            </Card>

                        )
                    }) : (
                        <Typography sx={{ color: '#6b7385', gridColumn: '1 / -1', textAlign: 'center', mt: 6 }}>
                            No meetings yet. Your joined meetings will show up here.
                        </Typography>
                    )

                }
            </Box>

        </Box>
    )
}
