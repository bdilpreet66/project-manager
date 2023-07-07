import React from 'react';
import Navigation from './src/Navigation';

export default function App() {
  // Just for demonstration. Replace it with actual logic
  React.useEffect(() => {
    // Checking login status and user role from storage or API
    // setLoggedIn(true);
    // setManager(true);
  }, []);

  return <Navigation />;
}
