import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, Typography, Stack, Button, Avatar, Box, Divider } from "@mui/material";
import fetchModel,{getInitials} from "../../lib/fetchModelData";

export default function UserDetail({ userID }) {

  const { userId } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try{
        setUser(await fetchModel("/api/user/" + userId));
      }
      catch(error){
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [userId]);


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Card variant="outlined" sx={{ maxWidth: 500, width: '100%', borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', border: 'none' }}    >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3,
                boxShadow: 2
              }}
            >
              {getInitials(user.first_name, user.last_name)}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: 'primary.dark',
                  mb: 1
                }}
              >
                {user.first_name} {user.last_name}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                📍 Location
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {user.location || 'Not specified'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                💼 Occupation
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {user.occupation || 'Not specified'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                📖 About
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {user.description || 'No description available'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              component={Link}
              to={`/users/photos/${user._id}`}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                },
                transition: 'all 0.2s ease'
              }}
            >
              View Photos
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
