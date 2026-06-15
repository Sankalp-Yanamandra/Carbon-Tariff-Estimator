import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

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
      </main>
    </>
  );
}

export default App;