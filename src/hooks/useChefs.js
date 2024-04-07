import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

const useChefs = (cuisineId) => {
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to run the fetch operation as a side effect
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
        // Execute the query and get the snapshot
        const querySnapshot = await getDocs(chefsQuery);
        // Map through the documents in the snapshot to extract the chef data
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Update the chefs state with the fetched data
        setChefs(data);
      } catch (err) {
        // If an error occurs, set the error state
        setError(err.message);
      } finally {
        // When finished, set loading to false
        setIsLoading(false);
      }
    };

    if (cuisineId) {
      fetchChefs();
    }
  }, [cuisineId]);

  return { chefs, isLoading, error };
};

export default useChefs; // Export the component for use in other parts of the app