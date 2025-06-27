import React, { useState } from 'react';
import { 
    AppBar, 
    Box, 
    Toolbar, 
    Typography, 
    Button, 
    Container, 
    IconButton,
    Badge,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    useMediaQuery,
    useTheme,
    Paper,
    Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [showPromo, setShowPromo] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleLogout = () => {
        logout();
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClosePromo = () => {
        setShowPromo(false);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                <Avatar sx={{ bgcolor: 'black', mr: 1 }}>
                    <StorefrontIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6">
                    izam
                </Typography>
            </Box>
            <Divider />
            <List>
                <ListItem button component={RouterLink} to="/">
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Sell Your Product" />
                </ListItem>
                <ListItem button component={RouterLink} to="/cart">
                    <ListItemText primary="Cart" />
                </ListItem>
                {isAuthenticated ? (
                    <>
                        <ListItem>
                            <ListItemText primary={`Hi, ${user?.name}`} />
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </>
                ) : (
                    <ListItem button component={RouterLink} to="/login">
                        <ListItemText primary="Login" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            {showPromo && (
                <Paper 
                    square 
                    elevation={0}
                    sx={{ 
                        bgcolor: 'black', 
                        color: 'white', 
                        py: 1,
                        px: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative'
                    }}
                >
                    <Typography variant="body2" textAlign="center">
                        Sign up and get 20% off to your first order — 
                        <RouterLink to="/register" style={{ color: 'white', marginLeft: '4px', textDecoration: 'underline' }}>
                            Sign Up Now
                        </RouterLink>
                    </Typography>
                    <IconButton 
                        size="small" 
                        sx={{ 
                            color: 'white', 
                            position: 'absolute', 
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                        onClick={handleClosePromo}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Paper>
            )}
            
            <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'white' }}>
                <Container maxWidth="lg">
                    <Toolbar>
                        {/* Logo and left navigation group */}
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            {/* Logo with icon */}
                            <Box 
                                component={RouterLink}
                                to="/" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    textDecoration: 'none', 
                                    color: 'black',
                                    mr: 4
                                }}
                            >
                                <Avatar sx={{ bgcolor: 'black', mr: 1 }}>
                                    <StorefrontIcon fontSize="small" />
                                </Avatar>
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    izam
                                </Typography>
                            </Box>
                            
                            {!isMobile && (
                                <>
                                    <Button 
                                        component={RouterLink} 
                                        to="/"
                                        sx={{ 
                                            color: 'black', 
                                            mr: 2,
                                            textTransform: 'none',
                                            fontSize: '16px'
                                        }}
                                    >
                                        Products
                                    </Button>
                                    
                                    <Button 
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: 'black', 
                                            color: 'white',
                                            borderRadius: '4px',
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            '&:hover': { backgroundColor: '#333' }
                                        }}
                                    >
                                        Sell Your Product
                                    </Button>
                                </>
                            )}
                        </Box>
                        
                        {/* Right side with cart and account */}
                        {isMobile ? (
                            <>
                                <IconButton
                                    component={RouterLink}
                                    to="/cart"
                                    color="inherit"
                                    sx={{ mr: 2 }}
                                >
                                    <Badge badgeContent={0} color="primary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="end"
                                    onClick={handleDrawerToggle}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Drawer
                                    anchor="right"
                                    open={mobileOpen}
                                    onClose={handleDrawerToggle}
                                    ModalProps={{ keepMounted: true }}
                                >
                                    {drawer}
                                </Drawer>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton 
                                    component={RouterLink} 
                                    to="/cart"
                                    color="inherit"
                                    sx={{ mr: 2 }}
                                >
                                    <Badge badgeContent={0} color="primary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                                
                                {isAuthenticated ? (
                                    <>
                                        <Typography component="span" sx={{ mr: 2 }}>
                                            Hi, {user?.name}
                                        </Typography>
                                        <Button 
                                            onClick={handleLogout}
                                            sx={{ color: 'black' }}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        variant="contained"
                                        component={RouterLink} 
                                        to="/login"
                                        sx={{ 
                                            backgroundColor: 'black', 
                                            '&:hover': { backgroundColor: '#333' },
                                            borderRadius: '4px',
                                            textTransform: 'none',
                                            fontSize: '16px'
                                        }}
                                    >
                                        Login
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
};

export default Header;
