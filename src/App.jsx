import {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth} from "./config/firebase";
import SignIn from "./components/SignIn";
import PatientProfile from "./components/PatientProfile";
import PatientFeedBack from "./components/PatientFeedBack";
import Sidebar from "./components/SideBar";
import Home from "./components/Home";
function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Router>
        {user ? (
          <div className="flex min-h-screen">
            <Sidebar handleLogout={handleLogout} />
            <div className="flex-1 p-7 bg-gray-100">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<PatientProfile />} />
                <Route path="/feedback" element={<PatientFeedBack />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        )}
      </Router>
    </>
  );
}

export default App;
