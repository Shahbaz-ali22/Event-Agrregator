import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';

function App() {
  return (
    <Router>
      <div className="min-h-full h-full w-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 w-full px-4 py-6 overflow-auto">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetails />} />
          </Routes>
        </main>
        <footer className="bg-white border-t w-full mt-auto">
          <div className="px-4 py-4">
            <p className="text-center text-gray-500 text-sm">
              © 2024 Sydney Events. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
