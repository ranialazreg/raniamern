import React from 'react';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import './Home.css'; // Custom CSS

function Home() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-background">
      <Container maxWidth="md" className="dashboard-container" sx={{ marginTop: '100px' }}>
        {/* Paper with transparent glass-like background */}
        <Paper elevation={4} sx={{ padding: '50px', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>

          {/* Header Section */}
          <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#3f51b5' }}>
            Tableau de bord Admin
          </Typography>
          <Typography variant="h6" sx={{ color: '#555', marginBottom: '40px' }}>
            Bienvenue sur votre portail administrateur. Choisissez une option ci-dessous pour commencer.
          </Typography>

          {/* Box for Button Layout */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
            {/* Manage Adherents Button */}
            <Button
              className="dashboard-button"
              variant="contained"
              color="primary"
              startIcon={<GroupIcon />}
              onClick={() => navigate('/adherents')}
            >
              Gérer les Adhérents
            </Button>

            {/* Manage Products Button */}
            <Button
              className="dashboard-button"
              variant="contained"
              color="secondary"
              startIcon={<StoreIcon />}
              onClick={() => navigate('/produits')}
            >
              Gérer les Produits
            </Button>
          </Box>

        </Paper>
      </Container>
    </div>
  );
}

export default Home;
