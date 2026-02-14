import React, { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText, Divider, Box, Typography, Avatar } from "@mui/material";
import { Link } from "react-router-dom";

import fetchModel, { getInitials } from "../../lib/fetchModelData";

export default function UserList() {
  const [user, setUser] = useState([]);
  const [photo, setPhoto] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUser(await fetchModel("/api/user/list"));
        setPhoto(await fetchModel("/api/photosOfUser/list"));
      }
      catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchData();
  }, []);
  console.log(photo);

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>

      <List
        component="nav"
        disablePadding
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: 'background.paper',
          boxShadow: 2,
          overflow: 'hidden'
        }}
      >
        {user.map((u, index) => (
          <React.Fragment key={u._id}>
            <ListItemButton
              component={Link}
              to={`/users/${u._id}`}
              sx={{
                px: 3,
                py: 2,
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: 'primary.contrastText',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '1.2rem', mr: 2, boxShadow: 1 }}
                    >
                      {getInitials(u.first_name, u.last_name)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 550 }}>
                      {u.first_name} {u.last_name}
                    </Typography>
                  </Box>
                }
                secondary={`${photo.filter(p => p.user_id._id === u._id).length} Photos ${photo.filter(p => p.user_id._id === u._id).reduce((acc, p) => acc + p.comments.length, 0)} Comments`}
              />
            </ListItemButton>
            {index < user.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>

  );
}
