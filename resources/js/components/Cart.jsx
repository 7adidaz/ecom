import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    TextField, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../services/api';

const Cart = ({ cartItems, removeFromCart, clearCart }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [open, setOpen] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!shippingAddress || !billingAddress) {
            setError('Please fill in all required fields');
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
                shipping_address: shippingAddress,
                billing_address: billingAddress
            };
            
            const response = await createOrder(orderData);
            
            // Clear the cart and close the dialog
            clearCart();
            setOpen(false);
            
            // Navigate to the order details page
            navigate(`/orders/${response.order_id}`);
        } catch (error) {
            console.error('Order error:', error);
            setError(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Your Cart
                    </Typography>
                    <Typography color="text.secondary">
                        Your cart is empty.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Your Cart
                    </Typography>
                    
                    <List disablePadding>
                        {cartItems.map((item) => (
                            <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                                <ListItemText 
                                    primary={item.name} 
                                    secondary={`Quantity: ${item.quantity}`} 
                                />
                                <Typography variant="body2">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                                <Button 
                                    size="small" 
                                    color="error" 
                                    onClick={() => removeFromCart(item.id)}
                                    sx={{ ml: 2 }}
                                >
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                        
                        <Divider />
                        
                        <ListItem sx={{ py: 1, px: 0 }}>
                            <ListItemText primary="Total" />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                ${total.toFixed(2)}
                            </Typography>
                        </ListItem>
                    </List>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleCheckout}
                        >
                            Checkout
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            
            {/* Checkout Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="shippingAddress"
                        label="Shipping Address"
                        name="shippingAddress"
                        autoComplete="shipping-address"
                        multiline
                        rows={3}
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                    />
                    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="billingAddress"
                        label="Billing Address"
                        name="billingAddress"
                        autoComplete="billing-address"
                        multiline
                        rows={3}
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Place Order'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Cart;
