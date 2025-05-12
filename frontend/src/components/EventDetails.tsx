import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  category: string;
  imageUrl: string;
  ticketUrl: string;
  price: {
    from: number;
    to: number;
    currency: string;
  };
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [hasOptedIn, setHasOptedIn] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleGetTickets = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/users/interest', {
        email,
        eventId: id,
        hasOptedIn
      });
      
      setIsEmailModalOpen(false);
      window.open(event?.ticketUrl, '_blank');
    } catch (err) {
      console.error('Failed to register interest:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center text-red-600 py-8">
        {error || 'Event not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-primary-600 flex items-center"
      >
        ← Back to Events
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img
            src={event.imageUrl || '/default-event.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-6 w-6 mr-2" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                {event.time && <p>{event.time}</p>}
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-6 w-6 mr-2" />
              <div>
                <p className="font-medium">Venue</p>
                <p>{event.venue.name}</p>
                <p>{event.venue.address}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <h2 className="text-xl font-semibold mb-2">About This Event</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {event.price && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Pricing</h2>
              <p className="text-gray-600">
                From {event.price.currency} {event.price.from}
                {event.price.to && ` to ${event.price.currency} ${event.price.to}`}
              </p>
            </div>
          )}

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <TicketIcon className="h-5 w-5 mr-2" />
            Get Tickets
          </button>
        </div>
      </div>

      <Dialog
        open={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="fixed inset-0 bg-black bg-opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Almost there!
            </Dialog.Title>

            <form onSubmit={handleGetTickets}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasOptedIn}
                    onChange={(e) => setHasOptedIn(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-600">
                    Keep me updated about similar events
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Continue to Tickets
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EventDetails; 