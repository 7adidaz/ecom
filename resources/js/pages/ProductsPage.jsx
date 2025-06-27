import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Typography, 
    Box, 
    Pagination, 
    CircularProgress, 
    Alert, 
    Paper,
    Breadcrumbs,
    Link,
    TextField,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Slider,
    Button,
    Divider,
    Card,
    CardContent,
    useMediaQuery,
    useTheme,
    Drawer,
    IconButton,
    Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// OrderSummary Component for the right sidebar
const OrderSummary = ({ cartItems, onCheckout }) => {
    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 10;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return (
        <Card variant="outlined" sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: { xs: 4, md: 0 },
            position: 'sticky',
            top: '20px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { md: '1.25rem' }, mb: 2 }}>
                Order Summary
            </Typography>
            
            {cartItems.length === 0 ? (
                <Typography color="text.secondary" my={2}>
                    Your cart is empty
                </Typography>
            ) : (
                <>
                    <Box sx={{ maxHeight: '350px', overflowY: 'auto', mb: 3 }}>
                        {cartItems.map(item => (
                            <Box key={item.id} sx={{ 
                                display: 'flex', 
                                py: 2, 
                                borderBottom: '1px solid #eee',
                                '&:last-child': { borderBottom: 'none' }
                            }}>
                                <Box sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    bgcolor: '#f0f0f0', 
                                    mr: 2,
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                                        {item.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty: {item.quantity}
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                        <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">Shipping</Typography>
                        <Typography variant="body1">${shipping.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" color="text.secondary">Tax</Typography>
                        <Typography variant="body1">${tax.toFixed(2)}</Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
                    </Box>
                </>
            )}
            
            <Button 
                variant="contained" 
                fullWidth
                sx={{ 
                    py: 2,
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    bgcolor: 'black', 
                    '&:hover': { 
                        bgcolor: '#333',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                    },
                    '&.Mui-disabled': {
                        bgcolor: '#ccc',
                    },
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                disabled={cartItems.length === 0}
                onClick={onCheckout}
            >
                Proceed to Checkout
            </Button>
        </Card>
    );
};

// ProductFilter Component for the left sidebar
const ProductFilterSidebar = ({ onApply, categories, onClose }) => {
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [selectedCategories, setSelectedCategories] = useState({
        All: true,
        'T-Shirts': false,
        Polo: false,
        Jeans: false,
        Shirts: false
    });
    
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };
    
    const handleCategoryChange = (category) => (event) => {
        // If "All" is selected, uncheck others
        if (category === 'All' && event.target.checked) {
            setSelectedCategories({
                All: true,
                'T-Shirts': false,
                Polo: false,
                Jeans: false,
                Shirts: false
            });
        } 
        // If a specific category is selected, uncheck "All"
        else if (category !== 'All') {
            setSelectedCategories({
                ...selectedCategories,
                All: false,
                [category]: event.target.checked
            });
        }
    };
    
    const handleApplyFilter = () => {
        // Get the selected categories (except "All")
        const categoryFilters = Object.entries(selectedCategories)
            .filter(([cat, selected]) => selected && cat !== 'All')
            .map(([cat]) => cat);
        
        onApply({
            price_range: priceRange,
            categories: categoryFilters.length > 0 ? categoryFilters : undefined
        });
        
        if (onClose) onClose();
    };
    
    const handleClearFilters = () => {
        setPriceRange([0, 300]);
        setSelectedCategories({
            All: true,
            'T-Shirts': false,
            Polo: false,
            Jeans: false,
            Shirts: false
        });
        onApply({});
        
        if (onClose) onClose();
    };
    
    return (
        <Box sx={{ p: 2, width: { xs: '100%', sm: 300 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Filters
                </Typography>
                {onClose && (
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Price Range
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={300}
                    sx={{ color: 'black' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="caption">${priceRange[0]}</Typography>
                    <Typography variant="caption">${priceRange[1]}</Typography>
                </Box>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
                Category
            </Typography>
            <FormGroup>
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={selectedCategories.All} 
                            onChange={handleCategoryChange('All')}
                            sx={{ '&.Mui-checked': { color: 'black' } }}
                        />
                    } 
                    label="All" 
                />
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={selectedCategories['T-Shirts']} 
                            onChange={handleCategoryChange('T-Shirts')}
                            sx={{ '&.Mui-checked': { color: 'black' } }}
                        />
                    } 
                    label="T-Shirts" 
                />
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={selectedCategories.Polo} 
                            onChange={handleCategoryChange('Polo')}
                            sx={{ '&.Mui-checked': { color: 'black' } }}
                        />
                    } 
                    label="Polo" 
                />
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={selectedCategories.Jeans} 
                            onChange={handleCategoryChange('Jeans')}
                            sx={{ '&.Mui-checked': { color: 'black' } }}
                        />
                    } 
                    label="Jeans" 
                />
                <FormControlLabel 
                    control={
                        <Checkbox 
                            checked={selectedCategories.Shirts} 
                            onChange={handleCategoryChange('Shirts')}
                            sx={{ '&.Mui-checked': { color: 'black' } }}
                        />
                    } 
                    label="Shirts" 
                />
            </FormGroup>
            
            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                    variant="contained" 
                    onClick={handleApplyFilter}
                    sx={{ 
                        bgcolor: 'black', 
                        '&:hover': { bgcolor: '#333' }
                    }}
                >
                    Apply Filter
                </Button>
                <Button 
                    variant="text" 
                    onClick={handleClearFilters}
                    sx={{ color: 'black' }}
                >
                    Clear All Filters
                </Button>
            </Box>
        </Box>
    );
};

// Main ProductsPage component
const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { cartItems, addToCart } = useCart();
    const [filters, setFilters] = useState({});
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchProducts();
    }, [page, filters]);
    
    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Add pagination to filters
            const params = {
                ...filters,
                page,
                per_page: 6,
                search: searchQuery || undefined
            };
            
            const data = await getProducts(params);
            setProducts(data.data);
            setTotalPages(data.last_page);
            
            // Extract unique categories from products for filter dropdown
            if (data.data.length > 0 && categories.length === 0) {
                const uniqueCategories = [...new Set(
                    data.data
                        .map(product => product.category)
                        .filter(category => category) // Filter out null/undefined
                )];
                setCategories(uniqueCategories);
            }
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };
    
    const handleFilterChange = (newFilters) => {
        setFilters({...filters, ...newFilters});
        setPage(1); // Reset to first page when filters change
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setFilters({...filters, search: searchQuery});
            setPage(1);
        }
    };
    
    const handleAddToCart = (item) => {
        addToCart(item);
        
        // Show cart drawer on mobile when adding items
        if (isMobile) {
            setCartDrawerOpen(true);
        }
    };
    
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };
    
    const handleCheckout = () => {
        // Navigate to cart page
        navigate('/cart');
    };
    
    const toggleFilterDrawer = (open) => () => {
        setFilterDrawerOpen(open);
    };
    
    const toggleCartDrawer = (open) => () => {
        setCartDrawerOpen(open);
    };
    
    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">Casual</Typography>
            </Breadcrumbs>

            {/* Top Action Bar - Search and Filter buttons */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={toggleFilterDrawer(true)}
                        sx={{ 
                            mr: 2, 
                            borderColor: 'black', 
                            color: 'black'
                        }}
                    >
                        Filters
                    </Button>
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        Casual
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        placeholder="Search by product name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearch}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        sx={{ width: { xs: '100%', sm: 250 } }}
                    />
                    
                    <IconButton 
                        onClick={toggleCartDrawer(true)}
                        sx={{ 
                            ml: 1,
                            display: { xs: 'inline-flex', md: 'none' }
                        }}
                        aria-label="cart"
                    >
                        <Badge 
                            badgeContent={cartItems.reduce((total, item) => total + item.quantity, 0)} 
                            color="primary"
                        >
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Box>

            {/* Main content */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                {/* Main Content - Products */}
                <Box sx={{ flex: '1 1 auto', width: { xs: '100%', md: 'calc(65% - 16px)' } }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}
                    
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress sx={{ color: 'black' }} />
                        </Box>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography>
                                        No products found matching your criteria.
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={3}>
                                    {products.map(product => (
                                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                                            <ProductCard 
                                                product={product} 
                                                addToCart={handleAddToCart} 
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination 
                                    count={totalPages} 
                                    page={page} 
                                    onChange={handlePageChange} 
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: 'black',
                                        },
                                        '& .Mui-selected': {
                                            bgcolor: 'black !important',
                                            color: 'white !important'
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </Box>

                {/* Right Sidebar - Order Summary */}
                <Box 
                    sx={{ 
                        width: { xs: '100%', md: '35%' },
                        position: { md: 'sticky' },
                        top: { md: '20px' },
                        alignSelf: 'flex-start'
                    }}
                >
                    <OrderSummary 
                        cartItems={cartItems} 
                        onCheckout={handleCheckout}
                    />
                </Box>
            </Box>
            
            {/* Filter Drawer */}
            <Drawer
                anchor="left"
                open={filterDrawerOpen}
                onClose={toggleFilterDrawer(false)}
                PaperProps={{ 
                    sx: { width: { xs: '80%', sm: 350 } } 
                }}
            >
                <ProductFilterSidebar 
                    onApply={handleFilterChange} 
                    categories={categories}
                    onClose={toggleFilterDrawer(false)}
                />
            </Drawer>
            
            {/* Cart Drawer - Mobile */}
            <Drawer
                anchor="right"
                open={cartDrawerOpen}
                onClose={toggleCartDrawer(false)}
                PaperProps={{ 
                    sx: { width: { xs: '80%', sm: 350 } } 
                }}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Your Cart
                        </Typography>
                        <IconButton onClick={toggleCartDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <OrderSummary 
                        cartItems={cartItems} 
                        onCheckout={handleCheckout}
                    />
                </Box>
            </Drawer>
        </Box>
    );
};

export default ProductsPage;
