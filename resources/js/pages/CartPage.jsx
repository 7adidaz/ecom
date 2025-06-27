import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Card,
    CardContent,
    CardMedia,
    Button,
    Divider,
    ButtonGroup,
    IconButton,
    Breadcrumbs,
    Link,
    Paper,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { createOrder } from '../services/api';

const CartPage = () => {
    const { isAuthenticated } = useAuth();
    const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, shipping, tax, total } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);

    const handleUpdateQuantity = (id, newQuantity) => {
        updateQuantity(id, newQuantity);
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handlePlaceOrder = async () => {
        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // Format order data for the API
            const orderData = {
                products: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                })),
                shipping_address: "Default Shipping Address", // Would be collected from a form in a real app
                billing_address: "Default Billing Address"    // Would be collected from a form in a real app
            };
            
            await createOrder(orderData);
            
            clearCart();
            setOrderSuccess(true);
        } catch (err) {
            console.error('Order error:', err);
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    // Order summary values come from the cart context

    return (
        <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 0, md: 2 } }}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">Cart</Typography>
            </Breadcrumbs>
            
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Your cart
            </Typography>
            
            {orderSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Your order has been placed successfully!
                </Alert>
            )}
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}
            
            <Grid container spacing={6}>
                {/* Cart Items */}
                <Grid item xs={12} md={6}>
                    {cartItems.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Your cart is empty
                            </Typography>
                            <Button 
                                variant="contained" 
                                href="/"
                                sx={{ 
                                    mt: 2, 
                                    bgcolor: 'black', 
                                    '&:hover': { bgcolor: '#333' }
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </Paper>
                    ) : (
                        <Box>
                            {cartItems.map((item) => (
                                <Card 
                                    key={item.id} 
                                    sx={{ 
                                        mb: 3, 
                                        display: 'flex', 
                                        p: 3,
                                        borderRadius: '12px',
                                        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{ 
                                            width: 130, 
                                            height: 130, 
                                            borderRadius: '8px',
                                            bgcolor: '#f5f5f5',
                                            backgroundSize: 'cover'
                                        }}
                                        image={item.image_url || 'https://via.placeholder.com/100?text=Product'}
                                    />
                                    <CardContent sx={{ flex: 1, display: 'flex', py: 1, px: 3 }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h5" component="h2" fontWeight="medium" sx={{ mb: 1 }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                                {item.category || 'Uncategorized'}
                                            </Typography>
                                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                                                Stock: {item.stock || 'Available'}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: '120px' }}>
                                            <Typography variant="h5" fontWeight="bold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
                                                    <IconButton 
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                                                        disabled={item.quantity <= 1}
                                                        sx={{ 
                                                            border: '1px solid rgba(0,0,0,0.2)',
                                                            borderRadius: '4px 0 0 4px',
                                                            height: '40px',
                                                            width: '40px'
                                                        }}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    
                                                    <Box 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            border: '1px solid rgba(0,0,0,0.2)', 
                                                            borderLeft: 0,
                                                            borderRight: 0,
                                                            width: '50px',
                                                            height: '40px',
                                                            fontSize: '1rem',
                                                            fontWeight: 'medium'
                                                        }}
                                                    >
                                                        {item.quantity}
                                                    </Box>
                                                    
                                                    <IconButton 
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        sx={{ 
                                                            border: '1px solid rgba(0,0,0,0.2)',
                                                            borderRadius: '0 4px 4px 0',
                                                            height: '40px',
                                                            width: '40px'
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </ButtonGroup>
                                                
                                                <IconButton 
                                                    onClick={() => handleRemoveItem(item.id)} 
                                                    color="error" 
                                                    sx={{
                                                        border: '1px solid rgba(220,0,0,0.2)',
                                                        width: '40px',
                                                        height: '40px'
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Grid>
                
                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        p: { xs: 4, md: 5 }, 
                        borderRadius: '12px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
                        position: 'sticky',
                        top: '20px',
                        maxWidth: {xs: '100%', md: '600px'},
                        width: '100%',
                        ml: {md: 'auto'},
                        mx: {xs: 'auto'},
                        height: 'fit-content'
                    }}>
                        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 1.5 }}>
                            Order Summary (#123)
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            {new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </Typography>
                        
                        <Divider sx={{ my: 3 }} />
                        
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography variant="h6" color="text.secondary">Subtotal</Typography>
                            <Typography variant="h6" fontWeight="medium">${subtotal.toFixed(2)}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography variant="h6" color="text.secondary">Shipping</Typography>
                            <Typography variant="h6" fontWeight="medium">${shipping.toFixed(2)}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                            <Typography variant="h6" color="text.secondary">Tax</Typography>
                            <Typography variant="h6" fontWeight="medium">${tax.toFixed(2)}</Typography>
                        </Box>
                        
                        <Divider sx={{ mb: 4, borderWidth: 1.5 }} />
                        
                        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" fontWeight="bold">Total</Typography>
                            <Typography variant="h4" fontWeight="bold">${total.toFixed(2)}</Typography>
                        </Box>
                        
                        <Button 
                            fullWidth 
                            variant="contained"
                            onClick={handlePlaceOrder}
                            disabled={cartItems.length === 0 || loading}
                            sx={{ 
                                py: 2.5,
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                borderRadius: 2.5,
                                bgcolor: 'black', 
                                '&:hover': { 
                                    bgcolor: '#333',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                },
                                '&.Mui-disabled': { bgcolor: '#ccc' },
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
                            }}
                        >
                            {loading ? 'Processing...' : 'Place the order'}
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CartPage;
