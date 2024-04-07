import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';

const useCuisinesDetails = (id) => {
    const [cuisine, setCuisine] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // useEffect hook to perform the side effect of fetching cuisine details from Firestore
    useEffect(() => {
        const fetchCuisine = async () => {
            if (!id) {
                setError('No ID provided');
                setIsLoading(false);
                return;
            }

            // Indicate that the loading process has started
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

export default useCuisinesDetails; // Export the component for use in other parts of the app
