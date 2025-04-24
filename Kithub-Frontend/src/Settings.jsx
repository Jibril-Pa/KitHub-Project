import React from 'react';
import { useEffect } from 'react';
function Settings() {
  useEffect(() => {
    document.title = "KitHub  | Settings";
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <button>First Name</button>
      <p>This is the settings page. Placeholder content for now.</p>
    </div>
  );
}

export default Settings;