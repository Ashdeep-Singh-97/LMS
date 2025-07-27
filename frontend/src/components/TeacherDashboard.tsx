import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Header from './Header';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  teacher: { name: string };
}

const TeacherDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [popupType, setPopupType] = useState<'create' | 'edit' | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { user } = useUser();
  const [error, setError] = useState<String | null>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    if (user?.role === 'teacher' || localStorage.getItem('role') === 'teacher') fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res: any = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/getCourses`, {
        withCredentials: true,
      });
      setCourses(res.data.courses);
      console.log(res.data.course);
    } catch (err : any) {
      if(err.response.data.message == 'Not authorized'){
        setError('Not authorized');
      }
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this course?');
    if (!confirm) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, { withCredentials: true });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  const handleCreate = async () => {
    const { title, description, category } = formData;
    if (!title || !description || !category) return alert('All fields are required');
    try {
      const res: any = await axios.post(`${import.meta.env.VITE_API_URL}/api/courses`, formData, {
        withCredentials: true,
      });
      setCourses([...courses, res.data.course]);
      closePopup();
    } catch (err) {
      console.error('Course creation failed:', err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCourse) return;
    const { title, description, category } = formData;
    if (!title || !description || !category) return alert('All fields are required');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/courses/${selectedCourse._id}`, formData, {
        withCredentials: true,
      });
      setCourses((prev) =>
        prev.map((c) => (c._id === selectedCourse._id ? { ...c, ...formData } : c))
      );
      closePopup();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const openEditPopup = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
    });
    setPopupType('edit');
  };

  const openCreatePopup = () => {
    setSelectedCourse(null);
    setFormData({ title: '', description: '', category: '' });
    setPopupType('create');
  };

  const closePopup = () => {
    setSelectedCourse(null);
    setPopupType(null);
    setFormData({ title: '', description: '', category: '' });
  };
  
  if(error){
    return(
      <div className="p-6 max-w-7xl mx-auto">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Teacher Dashboard</h2>
      </div >
      <div className="text-2xl font-bold text-red-300">
        {error}
      </div>
      </div>
    )
  }

  return (
    // (no logic changed, only UI modernized)
    <div className="p-6 max-w-7xl mx-auto">
      <Header />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Teacher Dashboard</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
          onClick={openCreatePopup}
        >
          + Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-5">
            <Link to={`/course/${course._id}`}>
              <h3 className="text-lg font-semibold text-blue-700">{course.title}</h3>
              <p className="text-sm italic text-gray-600">{course.category}</p>
              <p className="mt-2 text-gray-700 line-clamp-3">{course.description}</p>
            </Link>
            <div className="flex gap-3 mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                onClick={() => openEditPopup(course)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                onClick={() => handleDelete(course._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {popupType && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t p-6 z-50">
          <h2 className="text-xl font-semibold mb-4">
            {popupType === 'edit' ? 'Edit Course' : 'Create New Course'}
          </h2>
          <div className="grid gap-3">
            <input
              placeholder="Title"
              className="border p-2 rounded w-full"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              placeholder="Description"
              className="border p-2 rounded w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              placeholder="Category"
              className="border p-2 rounded w-full"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={closePopup}>
              Cancel
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={popupType === 'edit' ? handleUpdate : handleCreate}
            >
              {popupType === 'edit' ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default TeacherDashboard;
