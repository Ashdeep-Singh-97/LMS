import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import { useUser } from "../context/UserContext";

const Home = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-10">
      <Header />

      <div className="max-w-3xl mx-auto text-center mt-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6">
          Welcome {user?.name || 'Guest'} 👋
        </h1>

        <SearchBar />
      </div>
    </div>
  );
};

export default Home;
