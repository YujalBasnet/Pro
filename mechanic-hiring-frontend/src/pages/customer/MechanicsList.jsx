import { useState, useEffect } from 'react';
import api from '../../services/api';
import MechanicCard from '../../components/cards/MechanicCard';
import Loader from '../../components/common/Loader';

export default function MechanicsList() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mechanics');
      setMechanics(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch mechanics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Available Mechanics</h1>
        
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {mechanics.length === 0 ? (
          <p className="text-gray-600">No mechanics available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {mechanics.map((mechanic) => (
              <MechanicCard key={mechanic._id} mechanic={mechanic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}