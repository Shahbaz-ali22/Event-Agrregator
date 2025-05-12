import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  venue: {
    name: string;
    city: string;
  };
  imageUrl: string;
  ticketUrl: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events in Sydney</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={event.imageUrl || '/default-event.jpg'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h2>
              
              <div className="flex items-center text-gray-600 mb-2">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{event.venue.name}</span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {event.description}
              </p>
              
              <div className="flex justify-between items-center">
                <Link
                  to={`/event/${event._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Details
                </Link>
                
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Get Tickets
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList; 