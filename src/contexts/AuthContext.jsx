import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const AuthContext = createContext(null);

// Create local storage keys
const ADMIN_STATUS_KEY = 'admin_status';
const USER_EMAIL_KEY = 'user_email';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize from localStorage if available
    const savedStatus = localStorage.getItem(ADMIN_STATUS_KEY);
    return savedStatus === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
    return savedEmail ? { email: savedEmail } : null;
  });
  const [loading, setLoading] = useState(true);
  
  const db = getFirestore();
  
  // Verify authentication on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const savedEmail = localStorage.getItem(USER_EMAIL_KEY);
        if (savedEmail) {
          // Verify that the email still exists in the adminAuthentication collection
          const adminRef = collection(db, 'adminAuthentication');
          const q = query(adminRef, where('email', '==', savedEmail));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            setUser({ email: savedEmail });
            setIsAdmin(true);
          } else {
            // Clear localStorage if admin record no longer exists
            localStorage.removeItem(ADMIN_STATUS_KEY);
            localStorage.removeItem(USER_EMAIL_KEY);
            setUser(null);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        // In case of error, clear state to be safe
        localStorage.removeItem(ADMIN_STATUS_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, [db]);
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Check if the email exists in the adminAuthentication collection
      const adminRef = collection(db, 'adminAuthentication');
      const q = query(adminRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('You do not have admin privileges.');
        return false;
      }
      
      // Get the stored password from the admin document
      const adminDoc = querySnapshot.docs[0];
      const storedPassword = adminDoc.data().password;
      
      // Check if the provided password matches the stored password
      if (password !== storedPassword) {
        toast.error('Invalid credentials');
        return false;
      }
      
      // Store authentication info in localStorage
      localStorage.setItem(ADMIN_STATUS_KEY, 'true');
      localStorage.setItem(USER_EMAIL_KEY, email);
      
      // Update state
      setUser({ email });
      setIsAdmin(true);
      toast.success('Welcome back, Admin!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem(ADMIN_STATUS_KEY);
      localStorage.removeItem(USER_EMAIL_KEY);
      
      // Update state
      setIsAdmin(false);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAdmin, 
      user, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};