import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/api';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        fetchOrderDetails();
    }, [id]);
    
    const fetchOrderDetails = async () => {
        setLoading(true);
        setError('');
        
        try {
            const data = await getOrder(id);
            setOrder(data);
        } catch (err) {
            setError('Failed to load order details. Please try again later.');
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'info';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }
    
    if (!order) {
        return (
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography>Order not found or you do not have access to this order.</Typography>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Back to Products
                </Button>
            </Paper>
        );
    }
    
    return (
        <Box>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Back to Products
            </Button>
            
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Order #{order.id}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            Placed: {formatDate(order.created_at)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                        <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status)} 
                            sx={{ fontSize: '1rem', py: 2, px: 1 }}
                        />
                    </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell component="th" scope="row">
                                        {product.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        ${product.price_at_purchase.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {product.quantity}
                                    </TableCell>
                                    <TableCell align="right">
                                        ${product.subtotal.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={2} />
                                <TableCell align="right">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        Total:
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                        ${parseFloat(order.total_amount).toFixed(2)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default OrderDetailsPage;
