import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Check, Close } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Member {
  _id: string;
  name: string;
  mobile: string;
  imageUrl: string;
  hasPaidWeeklyFee: boolean;
  lastPaymentDate?: Date;
}

const Members: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    mobile: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError('Failed to load members');
      console.error('Error fetching members:', err);
    }
  };

  const handleAddMember = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newMember),
      });

      if (!response.ok) throw new Error('Failed to add member');

      const savedMember = await response.json();
      setMembers([...members, savedMember]);
      setNewMember({ name: '', mobile: '', imageUrl: '' });
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      setError('Failed to add member');
      console.error('Error adding member:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentStatus = async (memberId: string) => {
    try {
      const member = members.find(m => m._id === memberId);
      if (!member) return;

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hasPaidWeeklyFee: !member.hasPaidWeeklyFee,
          lastPaymentDate: !member.hasPaidWeeklyFee ? new Date() : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update payment status');

      const updatedMember = await response.json();
      setMembers(members.map(m => m._id === memberId ? updatedMember : m));
      setError(null);
    } catch (err) {
      setError('Failed to update payment status');
      console.error('Error updating payment status:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Members
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            disabled={loading}
          >
            Add Member
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {members.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={member.imageUrl || 'https://via.placeholder.com/200'}
                alt={member.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {member.mobile}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Weekly Fee Status:</Typography>
                  <Chip
                    icon={member.hasPaidWeeklyFee ? <Check /> : <Close />}
                    label={member.hasPaidWeeklyFee ? 'Paid' : 'Pending'}
                    color={member.hasPaidWeeklyFee ? 'success' : 'error'}
                    onClick={() => isAuthenticated && togglePaymentStatus(member._id)}
                  />
                </Box>
                {member.lastPaymentDate && (
                  <Typography variant="caption" display="block" mt={1}>
                    Last Payment: {new Date(member.lastPaymentDate).toLocaleDateString()}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mobile Number"
            fullWidth
            value={newMember.mobile}
            onChange={(e) => setNewMember({ ...newMember, mobile: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={newMember.imageUrl}
            onChange={(e) => setNewMember({ ...newMember, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddMember} color="primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Members; 