import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    category: string;
    teacher: { _id: string; name: string };
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { user } = useUser();
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (user?.role === 'student') {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}`, {
          withCredentials: true,
        })
        .then((res: any) => {
          const isEnrolled = res.data.course.enrolledStudents?.includes(user._id);
          setEnrolled(isEnrolled);
        })
        .catch((err) => {
          console.error('Error checking enrollment:', err);
        });
    }
  }, [course._id, user]);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res: any = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/student/enroll/${course._id}`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      setEnrolled(true);
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert('Already enrolled');
        setEnrolled(true);
      } else {
        console.error('Enroll failed:', err);
      }
    }
  };

  const handleUnenroll = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent <Link> navigation
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/unenroll/${course._id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        alert('✅ Unenrolled');
        setEnrolled(false); // update local state
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  return (
    <Link to={`/course/${course._id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition border p-5 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
          <p className="text-sm text-blue-600 mb-1">{course.category}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
          <p className="text-xs text-gray-500 mt-2">By {course.teacher.name}</p>
        </div>

        {user?.role === 'student' && (
          <button
            onClick={handleEnroll}
            disabled={enrolled}
            className={`mt-4 px-4 py-2 rounded text-sm font-medium transition ${enrolled
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {enrolled ? 'Enrolled' : 'Enroll'}
          </button>
        )}
        {enrolled && (
          <button
            onClick={handleUnenroll}
            className="mt-3 ml-2 px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Unenroll
          </button>
        )}

      </div>
    </Link>
  );
};

export default CourseCard;
