'use client';

/*
  Permission check: we treat the user with username "Antaqor" as the admin.
  The `isAdmin` variable below handles this. To support multiple admins later,
  fetch roles from your backend and check against an array of admin usernames.
*/

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  FolderIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../lib/config';
import StudyIconSrc from "@/app/img/study.svg";
import Image from "next/image";

interface Lesson {
  _id: string;
  videoUrl: string;
  title: string;
  description?: string;
  folder?: string;
  completed?: boolean;
  author?: { username: string };
  isRecorded?: boolean;
  isLive?: boolean;
}

export default function ClassroomPage() {
  const { user } = useAuth();
  const isAdmin = user?.username === 'Antaqor';

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newFolder, setNewFolder] = useState('General');
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const zoomRegex = /^https?:\/\/([a-z]+\.)?zoom\.us\/(rec\/share|j)\/[A-Za-z0-9\-_?=]+/;

  // Fetch lessons
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await axios.get<Lesson[]>(`${BASE_URL}/api/lessons`);
        const withCompletion = data.map((l) => ({ ...l, completed: false }));
        setLessons(withCompletion);
        if (withCompletion.length) setSelected(withCompletion[0]);
      } catch (err) {
        console.error('Lesson fetch error:', err);
      }
    };
    fetchLessons();
  }, []);

  const isValidUrl = zoomRegex.test(newUrl.trim());
  const validForm =
    isValidUrl && newTitle.trim() && newDesc.trim() && newFolder.trim();
  const progress = (['videoUrl', 'title', 'desc', 'folder'] as const).reduce(
    (acc, field) => {
      if (field === 'videoUrl' && isValidUrl) return acc + 1;
      if (field === 'title' && newTitle.trim()) return acc + 1;
      if (field === 'desc' && newDesc.trim()) return acc + 1;
      if (field === 'folder' && newFolder.trim()) return acc + 1;
      return acc;
    },
    0
  );
  const progressPct = (progress / 4) * 100;

  const addLesson = async () => {
    if (!user?.accessToken || !validForm) return;
    try {
      const { data } = await axios.post<Lesson>(
        `${BASE_URL}/api/lessons`,
        { videoUrl: newUrl, title: newTitle, description: newDesc, folder: newFolder },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      setLessons((prev) => [...prev, { ...data, completed: false }]);
      setNewTitle('');
      setNewUrl('');
      setNewDesc('');
      setNewFolder('General');
      setSelected(data);
    } catch (err) {
      console.error('Add lesson error:', err);
    }
  };

  const saveLesson = async () => {
    if (!editing || !user?.accessToken || !validForm) return;
    try {
      const { data } = await axios.put<Lesson>(
        `${BASE_URL}/api/lessons/${editing._id}`,
        { videoUrl: newUrl, title: newTitle, description: newDesc, folder: newFolder },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      setLessons((prev) => prev.map((l) => (l._id === data._id ? { ...data, completed: l.completed } : l)));
      setSelected((s) => (s && s._id === data._id ? { ...data, completed: s.completed } : s));
      setEditing(null);
      setNewTitle('');
      setNewUrl('');
      setNewDesc('');
      setNewFolder('General');
    } catch (err) {
      console.error('Save lesson error:', err);
    }
  };

  const deleteLesson = async (id: string) => {
    if (!user?.accessToken) return;
    try {
      await axios.delete(`${BASE_URL}/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setLessons((prev) => prev.filter((l) => l._id !== id));
      setSelected((s) => (s && s._id === id ? null : s));
    } catch (err) {
      console.error('Delete lesson error:', err);
    }
  };

  const toggleCompleted = (id: string) => {
    setLessons((prev) => prev.map((l) => (l._id === id ? { ...l, completed: !l.completed } : l)));
  };

  const folders = Array.from(new Set(lessons.map((l) => l.folder || 'General')));

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-black">
      <button
        className="md:hidden absolute top-2 left-2 z-[1000] p-2 bg-[#111111] hover:bg-[#323232] rounded-full shadow"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open lessons"
      >
        <Bars3Icon className="w-6 h-6 text-gray-600" />
      </button>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`bg-[#111111] p-6 border-r border-gray-200 overflow-y-auto md:h-screen md:sticky md:top-0 fixed inset-y-0 left-0 z-[1000] w-64 md:w-80 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <button
          className="md:hidden absolute top-2 right-2 p-1 z-[1001]"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close lessons"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Image src={StudyIconSrc} alt="Chat" width={24} height={24} className="w-6 h-6 group-hover:invert group-hover:brightness-0 transition-colors" />
   Lessons
        </h2>

        {isAdmin && (
          <div className="bg-[#111111] shadow rounded-lg p-3 mb-4">
            <div className="h-2 bg-gray-200 rounded mb-3 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <label className="block text-sm font-medium mb-1">Zoom бичлэгийн линк</label>
            <input
              type="text"
              placeholder="https://zoom.us/rec/share/…"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full border p-2 rounded mb-1 focus:ring-brand"
            />
            <p className={`text-sm ${isValidUrl ? 'text-gray-500' : 'text-red-500'}`}> 
              {isValidUrl ? 'Zoom-рекорд эсвэл шууд live линк оруулна уу.' : 'Zoom линк оруулна уу (zoom.us)'}
            </p>
            <input
              type="text"
              placeholder="Lesson title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border p-2 rounded mb-2 focus:ring"
            />
            <input
              type="text"
              placeholder="Folder"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              className="w-full border p-2 rounded mb-2 focus:ring"
            />
            <textarea
              placeholder="Short description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full border p-2 rounded mb-2 focus:ring"
            />
            <button
              onClick={editing ? saveLesson : addLesson}
              disabled={!validForm}
              className={`w-full py-2 rounded text-white ${validForm ? 'bg-brand' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {editing ? 'Save Lesson' : 'Add Lesson'}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setNewTitle('');
                  setNewUrl('');
                  setNewDesc('');
                  setNewFolder('General');
                }}
                className="w-full mt-2 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          {lessons.length === 0 && (
            <p className="text-center text-gray-500">No lessons yet. Start by adding one!</p>
          )}
          {folders.map((folder) => (
            <div key={folder} className="bg-[#111111] rounded">
              <div
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-[#323232]"
                onClick={() => setOpenFolders((o) => ({ ...o, [folder]: !o[folder] }))}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <FolderIcon className="w-5 h-5" /> {folder}
                </span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${openFolders[folder] ? 'rotate-180' : ''}`}
                />
              </div>
              {openFolders[folder] && (
                <div className="space-y-2 p-2">
                  {lessons
                    .filter((l) => (l.folder || 'General') === folder)
                    .map((lesson) => (
                      <div
                        key={lesson._id}
                        className={`flex items-center p-2 rounded shadow cursor-pointer hover:bg-[#323232] ${selected && selected._id === lesson._id ? 'bg-[#323232]' : 'bg-[#111111]'}`}
                        onClick={() => setSelected(lesson)}
                      >
                        <CheckIcon
                          className={`w-5 h-5 mr-2 ${lesson.completed ? 'text-green-500' : 'text-gray-400'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompleted(lesson._id);
                          }}
                        />
                        <span className="flex-1 truncate font-medium">{lesson.title}</span>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <PencilSquareIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditing(lesson);
                                setNewTitle(lesson.title);
                                setNewUrl(lesson.videoUrl);
                                setNewDesc(lesson.description || '');
                                setNewFolder(lesson.folder || 'General');
                              }}
                              className="w-5 h-5 text-cyan-400 cursor-pointer"
                            />
                            <TrashIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLesson(lesson._id);
                              }}
                              className="w-5 h-5 text-red-500 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10">
        {selected ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{selected.title}</h1>
            <div className="w-full max-w-4xl mb-4">
              {selected.isRecorded ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={`${selected.videoUrl}/player`}
                    className="absolute top-0 left-0 w-full h-full rounded-xl shadow"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href={selected.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand text-white px-4 py-2 rounded shadow inline-block"
                >
                  Join Live
                </a>
              )}
            </div>
            {selected.description && (
              <p className="text-lg text-gray-700 mb-2">{selected.description}</p>
            )}
            {selected.author?.username && (
              <p className="text-sm text-gray-500">By {selected.author.username}</p>
            )}
          </>
        ) : (
          <p className="flex items-center justify-center h-full text-gray-400 text-2xl">
            Select a lesson to get started
          </p>
        )}
      </main>
    </div>
  );
}
