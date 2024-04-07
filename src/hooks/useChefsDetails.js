import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

// Function to retrieve chef details given a chef ID, this is exported for potential use elsewhere
export const getChefDetail = async (chefId) => {
  if (!chefId) {
    throw new Error('No chef ID provided');
  }
  const chefRef = doc(db, 'chefs', chefId);
  const chefSnap = await getDoc(chefRef);

  if (!chefSnap.exists()) {
    throw new Error('Chef not found');
  }

  return { id: chefSnap.id, ...chefSnap.data() };
};

const useChefsDetails = (id) => {
  const [chefDetail, setChefDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect hook to perform the side effect of loading chef details
  useEffect(() => {
    if (!id) {
      setError('No chef ID provided');
      return;
    }
    setIsLoading(true);

    const fetchChef = async () => {
      const chefRef = doc(db, 'chefs', id);
      try {
        const chefSnap = await getDoc(chefRef);
        if (chefSnap.exists()) {
          setChefDetail({ id: chefSnap.id, ...chefSnap.data() });
        } else {
          setError('Chef not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChef();
  }, [id]);

  return { chefDetail, isLoading, error };
};

export default useChefsDetails; // Export the component for use in other parts of the app