import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Stack,
  Divider,
  TextField,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import fetchModel, { fmtDate, getInitials, baseURL } from "../../lib/fetchModelData";
export default function UserPhotos({ userID }) {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState({});
  const [editControl, setEditControl] = useState({});
  const [editComment, setEditComment] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPhotos(await fetchModel("/api/photosOfUser/" + userId));
        setUser(await fetchModel("/api/user/" + userId));

      }
      catch (error) {
        console.error("Error fetching user photos:", error);
      }
    };
    fetchData();
  }, [userId]);
  const handleComment = (photoId) => async () => {
    try {
      const response = await fetch(baseURL + "/api/comments/" + photoId, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comments[photoId] }),
      });
      if (response.ok) {
        const updatedPhotos = await fetchModel("/api/photosOfUser/" + userId);
        setPhotos(updatedPhotos);
        setComments({ ...comments, [photoId]: "" });
      }
    }
    catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  const handleDeleteComment = (photoId, commentId) => async () => {
    try {
      const response = await fetch(baseURL + "/api/comments/deleteComment", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, commentId }),
      });
      if (response.ok) {
        const updatedPhotos = await fetchModel("/api/photosOfUser/" + userId);
        setPhotos(updatedPhotos);
      }
    }
    catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleEditComment = (photoId, commentId) => async () => {
    try {
      const response = await fetch(baseURL + "/api/comments/editComment", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, commentId, newComment: editComment }),
      });
      if (response.ok) {
        const updatedPhotos = await fetchModel("/api/photosOfUser/" + userId);
        setPhotos(updatedPhotos);
        setEditControl(false);
        setEditComment("");
      }
    }
    catch (error) {
      console.error("Error editing comment:", error);
    }
  };
  const handleDeletePhoto = (photoId) => async () => {
    try {
      const response = await fetch(baseURL + "/api/photosOfUser/deletePhoto/" + photoId, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        const updatedPhotos = await fetchModel("/api/photosOfUser/" + userId);
        setPhotos(updatedPhotos);
      }
    }
    catch (error) {
      console.error("Error deleting photo:", error);
    }
  }
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, color: 'primary.main', textAlign: 'center', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        📸 Photos by {user.first_name} {user.last_name} ({photos.length})
      </Typography>

      {photos.map((ph) => (
        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 }, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }} >
          {ph.user_id === userID && (<Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
            onClick={handleDeletePhoto(ph._id)}
          >
            Delete
          </Button>)}
          <CardHeader
            title={
              <Chip
                label={fmtDate(ph.date_time)}
                size="small"
                sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 600 }}
              />
            }
            sx={{ pb: 1 }}
          />

          <CardMedia
            component="img"
            image={`${baseURL}/public/${ph.file_name}`}
            alt="user upload"
            sx={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: "0 0 12px 12px" }}
          />

          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}
            >
              💬 Comments ({(ph.comments || []).length})
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              {(ph.comments || []).length ? (
                ph.comments.map((c) => (
                  <Box key={c._id} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        sx={{ width: 32, height: 32, mr: 1.5, bgcolor: 'secondary.main' }}
                      >
                        {getInitials(c.user.first_name, c.user.last_name)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, lineHeight: 1.2 }}
                        >
                          <Link
                            to={`/users/${c.user._id}`}
                            style={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}
                          >
                            {c.user.first_name} {c.user.last_name}
                          </Link>
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {fmtDate(c.date_time)}
                        </Typography>

                      </Box>
                      {(c.user._id === userID) && (<Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <Button size="small" variant="outlined" onClick={() => { setEditControl({ ...editControl, [c._id]: !editControl[c._id] }); setEditComment(c.comment) }}  >
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={handleDeleteComment(ph._id, c._id)}>
                          Delete
                        </Button>
                      </Box>)}
                    </Box>
                    {!editControl[c._id] ? (<Typography sx={{ whiteSpace: "pre-wrap", pl: 5.5, color: 'text.primary' }}>
                      {c.comment}
                    </Typography>) : (
                      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                        <TextField
                          fullWidth
                          multiline
                          minRows={2}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          sx={{ pl: 5.5 }}
                        >
                        </TextField>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ alignSelf: "flex-end", mt: 1 }}
                          onClick={handleEditComment(ph._id, c._id)}
                        >
                          Save
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 2, fontStyle: 'italic' }}
                >
                  No comments yet. Be the first! ✨
                </Typography>
              )}
            </Stack>

            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                label="Add a comment..."
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={2}
                value={comments[ph._id] || ""}
                onChange={(e) => setComments({ ...comments, [ph._id]: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleComment(ph._id)}
                disabled={!comments[ph._id]?.trim()}
                sx={{
                  px: 3, borderRadius: 2, fontWeight: 600,
                  '&:hover': {
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Post
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      {photos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            📷 No photos yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This user hasn't shared any photos yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
