import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // make sure this is the correct path to your Firebase config

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

export default useChefsDetails;
