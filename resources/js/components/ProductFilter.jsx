import React, { useState } from 'react';
import { 
    Box, 
    Paper, 
    TextField, 
    Slider, 
    Typography, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    Button 
} from '@mui/material';

const ProductFilter = ({ onFilter, categories }) => {
    const [name, setName] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [category, setCategory] = useState('');
    
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };
    
    const handleApplyFilter = () => {
        onFilter({
            name: name || undefined,
            min_price: priceRange[0] || undefined,
            max_price: priceRange[1] || undefined,
            category: category || undefined,
        });
    };
    
    const handleClearFilter = () => {
        setName('');
        setPriceRange([0, 1000]);
        setCategory('');
        onFilter({});
    };
    
    return (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Filter Products
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Search by Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                
                <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={category}
                        label="Category"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All Categories</em>
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            
            <Box sx={{ width: '100%', mb: 3 }}>
                <Typography id="price-range-slider" gutterBottom>
                    Price Range
                </Typography>
                <Slider
                    getAriaLabel={() => 'Price range'}
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                        Min: ${priceRange[0]}
                    </Typography>
                    <Typography variant="body2">
                        Max: ${priceRange[1]}
                    </Typography>
                </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                    variant="outlined" 
                    onClick={handleClearFilter}
                >
                    Clear
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleApplyFilter}
                >
                    Apply Filters
                </Button>
            </Box>
        </Paper>
    );
};

export default ProductFilter;
