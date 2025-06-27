import React, { useState } from 'react';
import { 
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    ButtonGroup,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductCard = ({ product, addToCart }) => {
    const [quantity, setQuantity] = useState(0);
    
    const handleIncrement = () => {
        if (quantity < product.quantity_in_stock) {
            setQuantity(prevQty => prevQty + 1);
        }
    };
    
    const handleDecrement = () => {
        if (quantity > 0) {
            setQuantity(prevQty => prevQty - 1);
        }
    };
    
    const handleAddToCart = () => {
        if (quantity > 0) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
            setQuantity(0); // Reset quantity after adding to cart
        }
    };
    
    const placeholderImage = 'https://via.placeholder.com/300x200?text=Product+Image';
    
    return (
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
            <CardMedia
                component="div"
                sx={{ pt: '100%', position: 'relative' }} 
                image={product.image_url || placeholderImage}
                title={product.name}
            />
            
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" fontWeight="medium">
                        {product.name}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="black">
                        ${product.price}
                    </Typography>
                </Box>
                
                <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                        mb: 1,
                        display: 'block',
                        textTransform: 'capitalize'
                    }}
                >
                    {product.category || 'Uncategorized'}
                </Typography>
                
                <Typography variant="body2" color={product.quantity_in_stock > 0 ? 'success.main' : 'error.main'}>
                    {product.quantity_in_stock > 0 ? `Stock: ${product.quantity_in_stock}` : 'Out of Stock'}
                </Typography>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <ButtonGroup variant="outlined" size="small" sx={{ mr: 2 }}>
                        <IconButton 
                            onClick={handleDecrement} 
                            disabled={quantity === 0 || product.quantity_in_stock === 0}
                            size="small"
                            sx={{ border: '1px solid rgba(0,0,0,0.2)', borderRadius: '4px 0 0 4px' }}
                        >
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                        
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                border: '1px solid rgba(0,0,0,0.2)', 
                                borderLeft: 0,
                                borderRight: 0,
                                width: '40px',
                                height: '32px'
                            }}
                        >
                            {quantity}
                        </Box>
                        
                        <IconButton 
                            onClick={handleIncrement} 
                            disabled={quantity >= product.quantity_in_stock || product.quantity_in_stock === 0}
                            size="small"
                            sx={{ border: '1px solid rgba(0,0,0,0.2)', borderRadius: '0 4px 4px 0' }}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </ButtonGroup>
                    
                    <Button 
                        fullWidth
                        variant="contained" 
                        size="small"
                        onClick={handleAddToCart}
                        disabled={quantity === 0 || product.quantity_in_stock === 0}
                        sx={{ 
                            bgcolor: 'black', 
                            '&:hover': { bgcolor: '#333' },
                            '&.Mui-disabled': { bgcolor: '#ccc' }
                        }}
                    >
                        Add to Cart
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
