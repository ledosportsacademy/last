import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Download as DownloadIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analysis: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    weeklyFeeCollection: 0,
    pendingFees: 0,
    donationTotal: 0,
    expenses: 0,
    availableAmount: 0,
  });

  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    type: 'all',
  });

  useEffect(() => {
    fetchAnalysisData();
  }, [filters]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analysis?' + new URLSearchParams({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        type: filters.type,
      }));

      if (!response.ok) {
        throw new Error('Failed to fetch analysis data');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load analysis data. Please try again later.');
      console.error('Analysis fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const barChartData = {
    labels: ['Weekly Fees', 'Pending Fees', 'Donations', 'Expenses', 'Available'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [
          stats.weeklyFeeCollection,
          stats.pendingFees,
          stats.donationTotal,
          stats.expenses,
          stats.availableAmount,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const doughnutData = {
    labels: ['Weekly Fees', 'Donations', 'Expenses'],
    datasets: [
      {
        data: [stats.weeklyFeeCollection, stats.donationTotal, stats.expenses],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      },
    ],
  };

  const handleDownloadReport = () => {
    const report = `LEDO SPORTS ACADEMY - Financial Report
Period: ${filters.startDate.toLocaleDateString()} to ${filters.endDate.toLocaleDateString()}
Type: ${filters.type}
Weekly Fee Collection: ₹${stats.weeklyFeeCollection}
Pending Fees: ₹${stats.pendingFees}
Donation Total: ₹${stats.donationTotal}
Total Expenses: ₹${stats.expenses}
Available Amount: ₹${stats.availableAmount}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${filters.startDate.toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Financial Analysis
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFilters({ ...filters, startDate: newValue });
                    }
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFilters({ ...filters, endDate: newValue });
                    }
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="fees">Fees Only</MenuItem>
                  <MenuItem value="donations">Donations Only</MenuItem>
                  <MenuItem value="expenses">Expenses Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Weekly Fee Collection
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ₹{stats.weeklyFeeCollection}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pending Fees
                  </Typography>
                  <Typography variant="h4" color="error">
                    ₹{stats.pendingFees}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Available Amount
                  </Typography>
                  <Typography variant="h4" color="success">
                    ₹{stats.availableAmount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Financial Overview
                  </Typography>
                  <Box height={300}>
                    <Bar
                      data={barChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Income Distribution
                  </Typography>
                  <Box height={300}>
                    <Doughnut
                      data={doughnutData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Analysis; 