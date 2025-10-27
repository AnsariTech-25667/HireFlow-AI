import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JobListing from '../components/JobListing';
import AppDownload from '../components/AppDownload';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {' '}
        {/* Add padding-top to account for fixed navbar */}
        <Hero />
        <JobListing />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
