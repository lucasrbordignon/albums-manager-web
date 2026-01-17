import { Box } from '@mui/material';

export default function AuthImageSide() {
  return (
    <Box
      sx={{
        flex: 1.5,
        position: 'relative',
        display: { xs: 'none', md: 'block' },
        overflow: 'hidden',
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1494621622354-777dad9c18e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Background"
        className="object-cover w-full h-full"
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(255,255,255,0.3) 100%)',
        }}
      />
    </Box>
  );
}