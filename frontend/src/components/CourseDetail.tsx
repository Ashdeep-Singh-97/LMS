import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  teacher: {
    _id: string;
    name: string;
  };
  lessons: {
    title: string;
    content: string;
  }[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res : any = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!course) return <p className="p-4">Course not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="italic text-sm text-gray-500">{course.category}</p>
      <p className="mt-2">{course.description}</p>
      <p className="mt-1 text-gray-700">Instructor: {course.teacher.name}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Lessons:</h2>
      <ul className="list-disc ml-6">
        {course.lessons?.map((lesson, index) => (
          <li key={index} className="mb-2">
            <strong>{lesson.title}:</strong> {lesson.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetail;
