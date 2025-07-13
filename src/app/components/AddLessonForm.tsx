import { useState } from 'react';

interface Props {
  onSubmit: (payload: { videoUrl: string; title: string; description: string; folder: string }) => void;
}

export default function AddLessonForm({ onSubmit }: Props) {
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [folder, setFolder] = useState('General');

  const zoomRegex = /^https?:\/\/([a-z]+\.)?zoom\.us\/(rec\/share|j)\/[A-Za-z0-9\-_?=]+/;
  const isValidUrl = zoomRegex.test(videoUrl.trim());
  const valid = isValidUrl && title.trim() && description.trim() && folder.trim();

  const handleSubmit = () => {
    if (!valid) return;
    onSubmit({ videoUrl, title, description, folder });
    setVideoUrl('');
    setTitle('');
    setDescription('');
    setFolder('General');
  };

  return (
    <div className="bg-[#111111] shadow rounded-lg p-3 mb-4">
      <input
        type="text"
        placeholder="https://zoom.us/rec/share/…"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        className="w-full border p-2 rounded mb-1 focus:ring-brand"
      />
      <p className={`text-sm ${isValidUrl ? 'text-gray-500' : 'text-red-500'}`}>
        {isValidUrl ? 'Zoom-рекорд эсвэл шууд live линк оруулна уу.' : 'Zoom линк оруулна уу (zoom.us)'}
      </p>
      <input
        type="text"
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-2 focus:ring"
      />
      <input
        type="text"
        placeholder="Folder"
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        className="w-full border p-2 rounded mb-2 focus:ring"
      />
      <textarea
        placeholder="Short description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded mb-2 focus:ring"
      />
      <button
        onClick={handleSubmit}
        disabled={!valid}
        className={`w-full py-2 rounded text-white ${valid ? 'bg-brand' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Add Lesson
      </button>
    </div>
  );
}
