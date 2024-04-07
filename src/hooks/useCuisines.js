import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const useCuisines = () => {
    const [cuisines, setCuisines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to run side effects, in this case, fetching data from Firestore
    useEffect(() => {
        const getCuisines = async () => {
            setIsLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'cuisines'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCuisines(data);
            } catch (error) {
                setError('Error fetching cuisines.');
            }
            setIsLoading(false);
        };

        getCuisines();
    }, []);

    return { cuisines, isLoading, error };
};

export default useCuisines; // Export the component for use in other parts of the app