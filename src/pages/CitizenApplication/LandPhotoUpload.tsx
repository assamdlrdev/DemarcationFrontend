import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, Button, FormHelperText } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const LandPhotoUpload = ({ modalControl, modalErrors }) => {
  return (
    <Controller
      name="landPhoto"
      control={modalControl}
      rules={{ required: 'Land photo is required' }}
      render={({ field }) => (
        <Box className="upload-photo-container">
          <label htmlFor="land-photo-upload" className="upload-photo-label">
            <input
              id="land-photo-upload"
              type="file"
              hidden
              accept="image/*"
              capture="camera"  // This will trigger the device camera for mobile
              onChange={(e) => {
                const file = e.target.files?.[0];
                field.onChange(file);
              }}
            />
            <Box
              className={`upload-photo-button ${modalErrors.landPhoto ? 'upload-photo-button-error' : ''}`}
              component="div"
              sx={{
                ...(modalErrors.landPhoto && {
                  border: '2px dashed #d32f2f',
                  borderColor: '#d32f2f',
                }),
              }}
            >
              {field.value && field.value instanceof File ? (
                <Box className="upload-photo-preview">
                  <ImageIcon sx={{ fontSize: 36, color: '#728fd9' }} />
                  <Box className="upload-photo-info">
                    <Box className="upload-photo-name">{field.value.name}</Box>
                    <Box className="upload-photo-size">
                      {(field.value.size / 1024 / 1024).toFixed(2)} MB
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      field.onChange(null);
                      const input = document.getElementById('land-photo-upload');
                      if (input) input.value = '';
                    }}
                    sx={{
                      mt: 0.5,
                      textTransform: 'none',
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      '&:hover': {
                        borderColor: '#d32f2f',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)',
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Box className="upload-photo-placeholder">
                  <CloudUploadIcon sx={{ fontSize: 36, color: '#728fd9', mb: 0.5 }} />
                  <Box className="upload-photo-text">
                    <Box className="upload-photo-title">Upload Land Photo</Box>
                    <Box className="upload-photo-subtitle">Click to browse or drag and drop</Box>
                    <Box className="upload-photo-hint">Supports: JPG, PNG, GIF (Max 10MB)</Box>
                  </Box>
                </Box>
              )}
            </Box>
          </label>
          {modalErrors.landPhoto && (
            <FormHelperText error sx={{ mt: 1, ml: 1 }}>
              {modalErrors.landPhoto.message}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default LandPhotoUpload;
