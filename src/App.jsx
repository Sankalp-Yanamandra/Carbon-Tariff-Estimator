import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

// 1. Import the Toast Container and both CSS files
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Global CSS for the modal : alternative to windows.confirm() for Delete Account option.
import 'react-confirm-alert/src/react-confirm-alert.css'; 

function App() {
  return (
    <>
      {/*
          Navbar component outside Routers means, Navbar visible at top on all components. 
       */}
      <Navbar />
      {/*
          main : semantic <div> tag like nav, header etc for easy css styling
       */}
      <main>
        <AppRoutes />
        
        <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        theme="colored" 
      />
      </main>
    </>
  );
}

export default App;