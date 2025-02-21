import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/category-form');
  }, [router]);

  return null; // No need to render anything
};

export default Home;