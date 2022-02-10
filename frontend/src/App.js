import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScreenRoutes from "./screens/ScreenRoutes";
import ScrollToTop from "./components/ScrollToTop";
import Meta from "./components/Meta";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Meta />
      <Header />
      <main>
        <ScreenRoutes />
      </main>
      <Footer />
    </Router>
  );
};

export default App;
