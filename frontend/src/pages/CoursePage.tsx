import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Lesson {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
}

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

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  oauthProvider?: string;
  oauthId?: string;
  enrolledCourses?: string[];
  createdCourses?: string[];
}

const CoursePage = () => {
  const { id } = useParams();
  const { user } = useUser() as { user: User | null };

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '' });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const isOwner = user && user.role === 'teacher' && user._id === course?.teacher._id;

  useEffect(() => {
    const fetchCourseAndLessons = async () => {
      try {
        const courseRes = await axios.get<Course>(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);
        setCourse(courseRes.data);

        const lessonsRes = await axios.get<{ lessons: Lesson[] }>(
          `${import.meta.env.VITE_API_URL}/api/courses/${id}/lessons`,
          { withCredentials: true }
        );
        setLessons(lessonsRes.data.lessons);
      } catch (err) {
        console.error('Failed to load course or lessons:', err);
      }
    };

    fetchCourseAndLessons();
  }, [id]);

  const handleCreateOrUpdateLesson = async () => {
    try {
      if (editingLessonId) {
        // UPDATE
        const res = await axios.put<{ lesson: Lesson }>(
          `${import.meta.env.VITE_API_URL}/api/courses/${id}/lessons/${editingLessonId}`,
          lessonForm,
          { withCredentials: true }
        );

        setLessons((prev) =>
          prev.map((l) => (l._id === editingLessonId ? res.data.lesson : l))
        );
        setEditingLessonId(null);
      } else {
        // CREATE
        const res = await axios.post<{ lesson: Lesson }>(
          `${import.meta.env.VITE_API_URL}/api/courses/${id}/lessons`,
          lessonForm,
          { withCredentials: true }
        );
        setLessons([...lessons, res.data.lesson]);
      }

      setLessonForm({ title: '', content: '' });
    } catch (err) {
      console.error('Create/Update lesson failed:', err);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${id}/lessons/${lessonId}`, {
        withCredentials: true,
      });
      setLessons(lessons.filter((l) => l._id !== lessonId));
    } catch (err) {
      console.error('Delete lesson failed:', err);
    }
  };

  const startEditing = (lesson: Lesson) => {
    setEditingLessonId(lesson._id);
    setLessonForm({ title: lesson.title, content: lesson.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {course ? (
        <>
          <h1 className="text-3xl font-bold text-blue-700">{course.title}</h1>
          <p className="text-gray-700">{course.description}</p>
          <p className="italic text-sm mb-6">By {course.teacher.name}</p>

          {isOwner && (
            <div className="mb-6 border p-4 rounded bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">
                {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
              <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Title"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              />
              <input
                className="border p-2 rounded w-full mb-2"
                placeholder="Content"
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateOrUpdateLesson}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editingLessonId ? 'Update Lesson' : 'Create Lesson'}
                </button>
                {editingLessonId && (
                  <button
                    onClick={() => {
                      setEditingLessonId(null);
                      setLessonForm({ title: '', content: '' });
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-3">Lessons</h2>
          {lessons.length === 0 ? (
            <p className="text-gray-500">No lessons yet.</p>
          ) : (
            <ul className="space-y-5">
              {lessons.map((lesson) => (
                <li key={lesson._id} className="border p-4 rounded-lg bg-white shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                  <p className="mt-1 text-gray-700">{lesson.content}</p>

                  {lesson.videoUrl ? (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 text-blue-600 underline"
                    >
                      Watch Video
                    </a>
                  ) : user?.role === 'teacher' && isOwner ? (
                    <Link
                      to={`/teacher/${id}/${lesson._id}`}
                      className="inline-block mt-3 bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Start Lecture
                    </Link>
                  ) : (
                    <Link
                      to="/student"
                      className="inline-block mt-3 bg-red-600 text-white px-3 py-1 rounded"
                    >
                      No Lecture Yet – Join Room
                    </Link>
                  )}

                  {isOwner && (
                    <div className="mt-3 flex gap-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        onClick={() => startEditing(lesson)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        onClick={() => handleDeleteLesson(lesson._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Loading course...</p>
      )}
    </div>

  );
};

export default CoursePage;
