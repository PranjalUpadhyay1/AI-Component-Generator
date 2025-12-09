// Loader.tsx
import React, { useEffect, useState } from 'react';
import './Loader.css'; // Import CSS for styles

const Loader: React.FC = () => {
    const [dots, setDots] = useState<string>('');
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : '')); // Cycle through dots
        }, 1000); // Change dots every second

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loader-container">
             <div className="spinner"></div> {/*Spinner */}
            <div className="loading-text">
                Generating{dots}
            </div>
        </div>
    );
};

export default Loader;
