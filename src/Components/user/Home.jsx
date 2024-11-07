import React from 'react';
import App from './Sidebar';
import Navbar from '../shared/Navbar';

function Home2() {
  return (
    <div className='w-full'>
      <Navbar />
      <div className='mt-16'> {/* Adjust margin-top to avoid overlap */}
        <App />
      </div>
    </div>
  );
}

export default Home2;
