import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Header from './Header';

const StudentDashboard = () => {
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
const [error, setError] = useState<String | null>();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res: any = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/enrolledCourses`, {
          withCredentials: true,
        });
        setCourses(res.data.courses);
      } catch (err : any) {
        if(err.response.data.message == 'Not authorized'){
        setError('Not authorized');
      }
        console.error('Failed to fetch enrolled courses:', err);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/unenroll/${courseId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        alert('✅ Unenrolled');
        setCourses(prev => prev.filter(c => c._id !== courseId));
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  if(error){
    return(
      <div className="p-6 max-w-7xl mx-auto">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Student Dashboard</h2>
      </div >
      <div className="text-2xl font-bold text-red-300">
        {error}
      </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Header />
      <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white border rounded-lg shadow p-5">
            <Link to={`/course/${course._id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{course.title}</h2>
              <p className="text-gray-700 mt-2">{course.description}</p>
            </Link>
            <button
              onClick={() => handleUnenroll(course._id)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Unenroll
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
