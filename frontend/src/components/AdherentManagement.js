import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import { TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Typography, Container, Box, Snackbar, Alert, Pagination } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './AdherentManagement.css'; // Import CSS for AdherentManagement

function AdherentManagement() {
  const navigate = useNavigate();
  const [adherents, setAdherents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newAdherent, setNewAdherent] = useState({ name: '', email: '' });
  const [editAdherent, setEditAdherent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    fetchAdherents();
  }, [page, search]);

  const fetchAdherents = () => {
    api.get('/adherents', {
      params: {
        page,
        search,
      },
    })
    .then(response => {
      setAdherents(response.data.adherents);
      setTotalPages(response.data.totalPages);
    })
    .catch(error => console.error(error));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);  // Reset to first page on new search
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddAdherent = () => {
    if (validateInput(newAdherent)) {
      api.post('/adherents', newAdherent)
        .then(response => {
          fetchAdherents();
          setNewAdherent({ name: '', email: '' });
        })
        .catch(error => console.error(error));
    }
  };

  const handleUpdateAdherent = () => {
    if (validateInput(editAdherent)) {
      api.put(`/adherents/${editAdherent._id}`, editAdherent)
        .then(response => {
          fetchAdherents();
          setEditAdherent(null);
        })
        .catch(error => console.error(error));
    }
  };

  const handleDeleteAdherent = (id) => {
    api.delete(`/adherents/${id}`)
      .then(() => {
        fetchAdherents();
      })
      .catch(error => console.error(error));
  };

  const validateInput = (adherent) => {
    if (!adherent.name || !adherent.email) {
      showSnackbar('Nom et email sont obligatoires!', 'error');
      return false;
    }
    if (!isValidEmail(adherent.email)) {
      showSnackbar('Format de l\'email invalide!', 'error');
      return false;
    }
    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'error' });
  };

  return (
    <div className="adherent-background">
      <Container maxWidth="md" sx={{ marginTop: '50px' }}>
        <Paper elevation={3} sx={{ padding: '30px', borderRadius: '15px' }}>

          <Button variant="outlined" onClick={() => navigate('/')} sx={{ marginBottom: 2 }}>
            Retour à l'accueil
          </Button>
          
          <Typography variant="h4" gutterBottom>
            Gestion des Adhérents
          </Typography>

          {/* Barre de recherche */}
          <TextField
            label="Rechercher des adhérents"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 3 }}
            value={search}
            onChange={handleSearchChange}
          />

          {/* Liste des adhérents */}
          <List sx={{ marginBottom: 4 }}>
            {adherents.map(adherent => (
              <ListItem
                key={adherent._id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => setEditAdherent(adherent)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteAdherent(adherent._id)}>
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={adherent.name} secondary={adherent.email} />
              </ListItem>
            ))}
          </List>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} />
          </Box>

          {/* Formulaire d'ajout d'adhérent */}
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Ajouter un nouvel adhérent
          </Typography>
          <Box sx={{ display: 'flex', gap: '20px', marginBottom: 3 }}>
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              value={newAdherent.name}
              onChange={e => setNewAdherent({ ...newAdherent, name: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newAdherent.email}
              onChange={e => setNewAdherent({ ...newAdherent, email: e.target.value })}
            />
            <Button variant="contained" color="primary" onClick={handleAddAdherent}>
              Ajouter
            </Button>
          </Box>

          {/* Formulaire de modification d'adhérent */}
          {editAdherent && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Modifier l'adhérent
              </Typography>
              <Box sx={{ display: 'flex', gap: '20px', marginBottom: 3 }}>
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  value={editAdherent.name}
                  onChange={e => setEditAdherent({ ...editAdherent, name: e.target.value })}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={editAdherent.email}
                  onChange={e => setEditAdherent({ ...editAdherent, email: e.target.value })}
                />
                <Button variant="contained" color="primary" onClick={handleUpdateAdherent}>
                  Mettre à jour
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setEditAdherent(null)}>
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

export default AdherentManagement;
