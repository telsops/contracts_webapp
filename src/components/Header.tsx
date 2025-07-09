import React from 'react';
import Button from './Button';

interface HeaderProps {
    title: string;
    onLogout: () => void;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout, children }) => {
    return (
        <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-4">
                {children}
                <Button onClick={onLogout} variant="secondary">Logout</Button>
            </div>
        </header>
    );
};

export default Header;