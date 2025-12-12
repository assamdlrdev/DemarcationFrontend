import { CircularProgress, Box } from '@mui/material';
import './style.scss';

interface LoaderProps {
  type?: 'fullPage' | 'field';
  size?: number;
}

const Loader = ({ type = 'field', size }: LoaderProps) => {
  const defaultSize = type === 'fullPage' ? 60 : 24;

  if (type === 'fullPage') {
    return (
      <div className="loader-full-page">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            minHeight: '400px',
          }}
        >
          <CircularProgress size={size || defaultSize} />
          <div className="loader-text">Loading...</div>
        </Box>
      </div>
    );
  }

  return (
    <div className="loader-field">
      <CircularProgress size={size || defaultSize} />
    </div>
  );
};

export default Loader;

