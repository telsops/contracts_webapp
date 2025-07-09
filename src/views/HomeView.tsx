import React, { useState, useRef } from 'react';
import type { Estate } from '../types';
import { View, estateNames } from '../types';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import EstateButton from '../components/EstateButton';
import { useAuth } from '../hooks/useAuth';
import { createUser, loginUser, loginAdmin } from '../services/googleApiService';


interface HomeViewProps {
  setView: (view: View) => void;
  setSelectedEstate: (estate: Estate) => void;
}

type ModalType = 'userLogin' | 'userRegister' | 'adminLogin' | null;

const HomeView: React.FC<HomeViewProps> = ({ setView, setSelectedEstate }) => {
  const [modal, setModal] = useState<ModalType>(null);
  const [activeEstate, setActiveEstate] = useState<Estate | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginUser: authLoginUser, loginAdmin: authLoginAdmin } = useAuth();
  const estatesRef = useRef<HTMLDivElement>(null);

  const openModal = (type: ModalType, estate?: Estate) => {
    if (estate) setActiveEstate(estate);
    setModal(type);
    setError('');
    setEmail('');
    setPassword('');
  };

  const closeModal = () => {
    setModal(null);
    setActiveEstate(null);
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEstate) return;
    setIsLoading(true);
    setError('');
    try {
      const user = await loginUser(email, password, activeEstate);
      setSelectedEstate(activeEstate);
      authLoginUser(user, activeEstate);
      setView(View.UserDashboard);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and permissions.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        const admin = await loginAdmin(email, password);
        authLoginAdmin(admin);
        setView(View.AdminDashboard);
    } catch (err: any) {
        setError(err.message || 'Admin login failed. Please check your credentials.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleUserRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
        await createUser(email, password);
        alert('Account created successfully! Please contact an admin to grant you access to specific estates.');
        setModal('userLogin'); // Switch to login modal
    } catch (err: any) {
        setError(err.message || 'Registration failed.');
    } finally {
        setIsLoading(false);
    }
  };

  const scrollToEstates = () => {
    estatesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gray-900">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-down">
            Welcome to Aboitiz Estates'
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-8 animate-fade-in-up">
            Contracts Management System
            </h2>
            <button
            onClick={scrollToEstates}
            className="text-xl font-semibold text-gray-300 border-b-2 border-transparent hover:text-white hover:border-red-500 transition-all duration-300 animate-pulse"
            >
            Start Here &darr;
            </button>
        </div>

        <div ref={estatesRef} className="w-full max-w-6xl mx-auto pt-24">
            <h3 className="text-3xl font-bold text-center text-white mb-12">Select an Estate to View</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(Object.keys(estateNames) as Estate[]).map((key) => (
                    <EstateButton key={key} label={estateNames[key]} onClick={() => openModal('userLogin', key)} />
                ))}
            </div>

            <div className="mt-16 border-t border-gray-700 pt-10 flex justify-center">
                 <Button
                    onClick={() => openModal('adminLogin')}
                    variant="secondary"
                    className="py-3 px-8 text-lg"
                 >
                    ADMIN
                </Button>
            </div>
        </div>
      </div>
      
      {/* User Login/Register Modal */}
      <Modal isOpen={modal === 'userLogin' || modal === 'userRegister'} onClose={closeModal} title={modal === 'userLogin' ? `Login to ${estateNames[activeEstate!]}` : 'Create an Account'}>
        <form onSubmit={modal === 'userLogin' ? handleUserLogin : handleUserRegister} className="space-y-4">
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            {modal === 'userLogin' ? (
                <div className="flex flex-col space-y-2">
                    <Button type="submit" isLoading={isLoading} className="w-full">Login</Button>
                    <button type="button" onClick={() => setModal('userRegister')} className="text-sm text-red-400 hover:underline">
                        Create an account
                    </button>
                </div>
            ) : (
                <div className="flex flex-col space-y-2">
                     <Button type="submit" isLoading={isLoading} className="w-full">Create Account</Button>
                     <button type="button" onClick={() => setModal('userLogin')} className="text-sm text-red-400 hover:underline">
                        Already have an account? Login
                    </button>
                </div>
            )}
        </form>
      </Modal>

      {/* Admin Login Modal */}
      <Modal isOpen={modal === 'adminLogin'} onClose={closeModal} title="Admin Login">
        <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
            <Input label="Email" id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" isLoading={isLoading} className="w-full">Login</Button>
        </form>
      </Modal>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.3s forwards; }
      `}</style>
    </>
  );
};

export default HomeView;