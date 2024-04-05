import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path as needed
import { useState, useEffect } from 'react';

const useCuisinesDetails = (id) => {
    const [cuisine, setCuisine] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCuisine = async () => {
            if (!id) {
                setError('No ID provided');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const docRef = doc(db, 'cuisines', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCuisine({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError('Cuisine not found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(`Error fetching data: ${error.message}`);
            }
            
            setIsLoading(false);
        };

        fetchCuisine();
    }, [id]);

    return { cuisine, isLoading, error };
}

export default useCuisinesDetails;
