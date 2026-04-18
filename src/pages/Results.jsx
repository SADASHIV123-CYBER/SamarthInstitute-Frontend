import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import resultsCollage from '../assets/resultsCollage.png'

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get('/api/results').then((res) => setResults(res.data.results));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Achievers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500"
          >
            <h3 className="text-xl font-semibold">{result.name}</h3>
            <p className="text-3xl font-bold text-purple-700">{result.percentage}</p>
          </motion.div>
        ))}
      </div>
      {/* Result collage image placeholder */}
      <div className="mt-12">
        <img src={resultsCollage} alt="Results Collage" className="w-full rounded-lg shadow-md" />
      </div>
    </div>
  );
};

export default Results;