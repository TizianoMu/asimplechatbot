import React from 'react';
import './App.css';

const SeaBackground: React.FC = () => {
    return (
        <div id="sea" className="sea z-0">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="water" width=".25" height="2" patternContentUnits="objectBoundingBox">
                        <path fill="lightblue" d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,0.5z" />
                    </pattern>
                </defs>
                <rect id="waves" className="water-fill" fill="url(#water)" width="3000" />
            </svg>
        </div>
    );
};

export default SeaBackground;