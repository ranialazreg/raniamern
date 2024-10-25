import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Typography, Container, Box, Snackbar, Alert, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './ProductManagement.css'; // Custom CSS

function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '' });
  const [image, setImage] = useState(null);  // Store the selected image file
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = () => {
    api.get('/products', {
      params: { page, search },
    })
    .then(response => {
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    })
    .catch(error => console.error(error));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddProduct = () => {
    if (validateInput(newProduct)) {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('category', newProduct.category);
      formData.append('description', newProduct.description);
      if (image) {
        formData.append('image', image);
      }

      api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        fetchProducts();
        setNewProduct({ name: '', price: '', category: '', description: '' });
        setImage(null);
      })
      .catch(error => showSnackbar("Erreur lors de la création du produit", 'error'));
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdateProduct = () => {
    if (validateInput(editProduct)) {
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('price', editProduct.price);
      formData.append('category', editProduct.category);
      formData.append('description', editProduct.description);
      if (image) {
        formData.append('image', image);
      }

      api.put(`/products/${editProduct._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        fetchProducts();
        setEditProduct(null);
        setImage(null);
      })
      .catch(error => showSnackbar("Erreur lors de la mise à jour du produit", 'error'));
    }
  };

  const handleDeleteProduct = (id) => {
    api.delete(`/products/${id}`)
      .then(() => fetchProducts())
      .catch(error => showSnackbar("Erreur lors de la suppression du produit", 'error'));
  };

  const validateInput = (product) => {
    if (!product.name || !product.price || !product.category) {
      showSnackbar("Nom, prix et catégorie sont obligatoires!", 'error');
      return false;
    }
    return true;
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'error' });
  };

  return (
    <div className="product-background">
      <Container maxWidth="md" sx={{ marginTop: '50px' }}>
        <Paper elevation={3} sx={{ padding: '30px', borderRadius: '15px' }}>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ marginBottom: 2 }}>
            Retour à l'accueil
          </Button>
          <Typography variant="h4" gutterBottom>
            Gestion des Produits
          </Typography>

          {/* Barre de recherche */}
          <TextField
            label="Rechercher des produits"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 3 }}
            value={search}
            onChange={handleSearchChange}
          />

          {/* Liste des produits */}
          <List sx={{ marginBottom: 4 }}>
            {products.map(product => (
              <ListItem
                key={product._id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => setEditProduct(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteProduct(product._id)}>
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`${product.name} - ${product.price} €`}
                  secondary={
                    <>
                      {product.category}
                      {product.image && (
                        <img
                          src={`http://localhost:5000/api/products/uploads/${product.image}`}
                          alt={product.name}
                          style={{ width: '100px', height: '100px', objectFit: 'cover', marginLeft: '10px' }}
                        />
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} />
          </Box>

          {/* Formulaire d'ajout de produit */}
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Ajouter un nouveau produit
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: 3 }}>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <TextField
              label="Prix"
              variant="outlined"
              fullWidth
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <TextField
              label="Catégorie"
              variant="outlined"
              fullWidth
              value={newProduct.category}
              onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={newProduct.description}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            {/* Input pour l'image */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <Button variant="contained" color="primary" onClick={handleAddProduct}>
              Ajouter le produit
            </Button>
          </Box>

          {/* Formulaire de modification de produit */}
          {editProduct && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Modifier le produit
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: 3 }}>
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  value={editProduct.name}
                  onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                />
                <TextField
                  label="Prix"
                  variant="outlined"
                  fullWidth
                  value={editProduct.price}
                  onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                />
                <TextField
                  label="Catégorie"
                  variant="outlined"
                  fullWidth
                  value={editProduct.category}
                  onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={editProduct.description}
                  onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                />

                {/* Input pour l'image (mise à jour) */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <Button variant="contained" color="primary" onClick={handleUpdateProduct}>
                  Mettre à jour le produit
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditProduct(null)}>
                  Annuler
                </Button>
              </Box>
            </>
          )}
        </Paper>

        {/* Snackbar pour les notifications */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default ProductManagement;
