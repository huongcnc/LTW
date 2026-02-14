import { Box, Button, Card, Typography, LinearProgress, Alert } from "@mui/material";
import { useState, useRef } from "react";
import { baseURL } from "../../lib/fetchModelData";
import { useNavigate } from "react-router-dom";
export default function UploadPhoto({ userID }) {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const handleSelectFile = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile || !selectedFile.type.startsWith("image/")) {
            setError("Vui lòng chọn file ảnh hợp lệ");
            return;
        }

        setFile(selectedFile);
        setError("");
        setMessage("");

        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError("");
        setMessage("");

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const res = await fetch(baseURL + "/api/photosOfUser/uploadPhoto", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Upload ảnh thành công");
                setFile(null);
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                navigate("/users/photos/" + userID);
            } else {
                setError(data.message || "Upload thất bại");
            }
        } catch {
            setError("Lỗi mạng, vui lòng thử lại");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
            <Card sx={{ p: 3 }}>
                <Typography variant="h6" textAlign="center" mb={2}>
                    Upload Photo
                </Typography>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelectFile}
                />

                {preview && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: 250 }}
                        />
                        <Typography variant="body2">{file.name}</Typography>
                    </Box>
                )}

                {uploading && <LinearProgress sx={{ mt: 2 }} />}

                {message && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={!file || uploading}
                    onClick={handleUpload}
                >
                    Upload
                </Button>
            </Card>
        </Box>
    );
}
