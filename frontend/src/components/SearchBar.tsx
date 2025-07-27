import { useEffect, useState } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  teacher: {
    _id: string;
    name: string;
  };
}

const ITEMS_PER_PAGE = 6;

const SearchBar = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCourses = async (page: number = 1, searchQuery: string = '') => {
    try {
      setLoading(true);
      const res: any = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
        params: { page, limit: ITEMS_PER_PAGE, search: searchQuery },
      });
      setCourses(res.data.courses);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to fetch courses', err);
      setCourses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(1);
  }, []);

  useEffect(() => {
    fetchCourses(page, search);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchCourses(1, search);
  };

  const handleSearchForAll = () => {
    setPage(1);
    fetchCourses(1);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title, category, description"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <button
            onClick={handleSearchForAll}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            All Courses
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-red-500">No courses found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            {page > 1 && (
              <>
                <button onClick={() => setPage(1)} className="btn-page">
                  First
                </button>
                <button onClick={() => setPage(page - 1)} className="btn-page">
                  Prev
                </button>
              </>
            )}

            {Array.from({ length: totalPages })
              .map((_, idx) => idx + 1)
              .filter((p) => {
                if (totalPages <= 5) return true;
                if (page <= 3) return p <= 5;
                if (page >= totalPages - 2) return p >= totalPages - 4;
                return Math.abs(p - page) <= 2;
              })
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`btn-page ${
                    page === p ? 'bg-black text-white' : ''
                  }`}
                >
                  {p}
                </button>
              ))}

            {page < totalPages && (
              <>
                <button onClick={() => setPage(page + 1)} className="btn-page">
                  Next
                </button>
                <button onClick={() => setPage(totalPages)} className="btn-page">
                  Last
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
