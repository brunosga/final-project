import { useState, useEffect } from 'react';
import { db } from '../firebase'; // make sure this path is correct
import { collection, query, where, getDocs } from 'firebase/firestore';

const useChefs = (cuisineId) => {
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChefs = async () => {
      setIsLoading(true);
      try {
        if (!cuisineId) {
          throw new Error('No cuisineId provided');
        }
        // Query for chefs where the 'cuisineType' array contains the cuisineId
        const chefsQuery = query(
          collection(db, 'chefs'),
          where('cuisineType', 'array-contains', cuisineId)
        );
        const querySnapshot = await getDocs(chefsQuery);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChefs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (cuisineId) {
      fetchChefs();
    }
  }, [cuisineId]);

  return { chefs, isLoading, error };
};

export default useChefs;

