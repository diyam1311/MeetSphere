import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';



// Custom theme so the auth screen matches the app's dark, indigo-accented look.

const defaultTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#6366f1' },
        secondary: { main: '#FF9839' },
        background: { default: '#0b0f19', paper: '#141a2b' },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: '"Inter", "Manrope", -apple-system, sans-serif',
    },
});

export default function Authentication() {

    

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)


            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        background:
                            'radial-gradient(60% 50% at 20% 20%, rgba(255,152,57,0.18), transparent 60%), radial-gradient(55% 45% at 85% 80%, rgba(99,102,241,0.28), transparent 60%), #0b0f19',
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        px: { sm: 5, md: 8 },
                        gap: 2.5,
                    }}
                >
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <VideoCameraFrontIcon fontSize="medium" />
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif', maxWidth: 460 }}>
                        Meetings that just feel effortless
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 420 }}>
                        Sign in to start or join a call, chat with participants, and pick up right where you left off.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            width: '100%',
                            maxWidth: 380,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            {formState === 0 ? "Welcome back" : "Create an account"}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: 0.5,
                            p: 0.5,
                            borderRadius: '999px',
                            bgcolor: 'rgba(255,255,255,0.06)',
                            width: '100%',
                        }}>
                            <Button
                                fullWidth
                                sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 700 }}
                                variant={formState === 0 ? "contained" : "text"}
                                onClick={() => { setFormState(0) }}>
                                Sign In
                            </Button>
                            <Button
                                fullWidth
                                sx={{ borderRadius: '999px', textTransform: 'none', fontWeight: 700 }}
                                variant={formState === 1 ? "contained" : "text"}
                                onClick={() => { setFormState(1) }}>
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Full Name"
                                name="username"
                                value={name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                            /> : <></>}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}

                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}

                                id="password"
                            />

                            {error ? <Typography sx={{ color: '#f87171', fontSize: '0.875rem', mt: 0.5 }}>{error}</Typography> : null}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, py: 1.2, borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '1rem' }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>

                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar

                open={open}
                autoHideDuration={4000}
                message={message}
            />

        </ThemeProvider>
    );
}