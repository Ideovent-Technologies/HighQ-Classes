// // // src/modules/recordings/TeacherRecording.jsx



// import React, { useState, ChangeEvent } from "react";
// import RecordingCard from "./RecordingCard";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Recording } from "./dummyRecordings";

// const TeacherRecording: React.FC = () => {
//   const [recordings, setRecordings] = useState<Recording[]>([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     subject: "",
//     url: "",
//     date: new Date().toISOString().split("T")[0],
//     views: 0,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpload = () => {
//     if (!formData.title || !formData.subject || !formData.url) return;
//     const newRecording: Recording = {
//       id: Math.random().toString(),
//       title: formData.title,
//       subject: formData.subject,
//       url: formData.url,
//       date: formData.date,
//       topic: formData.title,
//       views: 0,
//       isActive: true,
//     };
//     setRecordings((prev) => [newRecording, ...prev]);
//     setFormData({ title: "", subject: "", url: "", date: new Date().toISOString().split("T")[0], views: 0 });
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">📤 Upload New Recording</h2>
//       <div className="grid gap-4 mb-6">
//         <div>
//           <Label>Title</Label>
//           <Input name="title" value={formData.title} onChange={handleChange} />
//         </div>
//         <div>
//           <Label>Subject</Label>
//           <Input name="subject" value={formData.subject} onChange={handleChange} />
//         </div>
//         <div>
//           <Label>Video URL</Label>
//           <Input name="url" value={formData.url} onChange={handleChange} />
//         </div>
//         <Button onClick={handleUpload}>Upload</Button>
//       </div>

//       <h3 className="text-xl font-semibold mb-3">📚 All Recordings</h3>
//       <div className="grid gap-4 sm:grid-cols-2">
//         {recordings.map((rec) => (
//           <RecordingCard
//             key={rec.id}
//             title={rec.title}
//             subject={rec.subject}
//             date={new Date(rec.date).toLocaleDateString()}
//             fileUrl={rec.url}
//             views={rec.views}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherRecording;


//right code

// import React, { useState, ChangeEvent } from "react";
// import RecordingCard from "./RecordingCard";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { dummyRecordings, Recording } from "./dummyRecordings";

// const TeacherRecording: React.FC = () => {
//   const [recordings, setRecordings] = useState<Recording[]>([...dummyRecordings]);
//   const [formData, setFormData] = useState({
//     title: "",
//     subject: "",
//     url: "",
//     date: new Date().toISOString().split("T")[0],
//     views: 0,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpload = () => {
//     if (!formData.title || !formData.subject || !formData.url) return;

//     const newRecording: Recording = {
//       id: Math.random().toString(),
//       title: formData.title,
//       subject: formData.subject,
//       url: formData.url,
//       date: formData.date,
//       topic: formData.title,
//       views: 0,
//       isActive: true,
//     };

//     // Push to global dummyRecordings
//     dummyRecordings.unshift(newRecording);

//     // Update local state to re-render
//     setRecordings((prev) => [newRecording, ...prev]);

//     // Clear form
//     setFormData({
//       title: "",
//       subject: "",
//       url: "",
//       date: new Date().toISOString().split("T")[0],
//       views: 0,
//     });
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">📤 Upload New Recording</h2>
//       <div className="grid gap-4 mb-6">
//         <div>
//           <Label>Title</Label>
//           <Input name="title" value={formData.title} onChange={handleChange} />
//         </div>
//         <div>
//           <Label>Subject</Label>
//           <Input name="subject" value={formData.subject} onChange={handleChange} />
//         </div>
//         <div>
//           <Label>Video URL</Label>
//           <Input name="url" value={formData.url} onChange={handleChange} />
//         </div>
//         <Button onClick={handleUpload}>Upload</Button>
//       </div>

//       <h3 className="text-xl font-semibold mb-3">📚 All Recordings</h3>
//       <div className="grid gap-4 sm:grid-cols-2">
//         {recordings.map((rec) => (
//           <RecordingCard
//             key={rec.id}
//             title={rec.title}
//             subject={rec.subject}
//             date={new Date(rec.date).toLocaleDateString()}
//             fileUrl={rec.url}
//             views={rec.views}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherRecording;




import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RecordingCard from "./RecordingCard";
import { Recording } from "./dummyRecordings";
import { getRecordings, saveRecording } from "@/utils/storage";

const TeacherRecording: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>(getRecordings());

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    url: "",
    date: new Date().toISOString().split("T")[0],
    views: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = () => {
    if (!formData.title || !formData.subject || !formData.url) return;

    const newRecording: Recording = {
      id: Math.random().toString(),
      title: formData.title,
      subject: formData.subject,
      url: formData.url,
      date: formData.date,
      topic: formData.title,
      views: 0,
      isActive: true,
    };

    saveRecording(newRecording);
    setRecordings([newRecording, ...recordings]);

    setFormData({
      title: "",
      subject: "",
      url: "",
      date: new Date().toISOString().split("T")[0],
      views: 0,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">📤 Upload New Recording</h2>
      <div className="grid gap-4 mb-6">
        <div>
          <Label>Title</Label>
          <Input name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <Label>Subject</Label>
          <Input name="subject" value={formData.subject} onChange={handleChange} />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input name="url" value={formData.url} onChange={handleChange} />
        </div>
        <Button onClick={handleUpload}>Upload</Button>
      </div>

      <h3 className="text-xl font-semibold mb-3">📚 All Recordings</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {recordings.map((rec) => (
          <RecordingCard
            key={rec.id}
            title={rec.title}
            subject={rec.subject}
            date={rec.date}
            fileUrl={rec.url}
            views={rec.views}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherRecording;



// import React, { useState, ChangeEvent, useEffect } from "react";
// import RecordingCard from "./RecordingCard";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Recording } from "./dummyRecordings";
// import { getRecordings, saveRecording } from "@/utils/storage";

// const TeacherRecording: React.FC = () => {
//   const [recordings, setRecordings] = useState<Recording[]>([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     subject: "",
//     url: "",
//     date: new Date().toISOString().split("T")[0],
//     views: 0,
//   });

//   useEffect(() => {
//     setRecordings(getRecordings());
//   }, []);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpload = () => {
//     if (!formData.title || !formData.subject || !formData.url) return;

//     const newRecording: Recording = {
//       id: Math.random().toString(),
//       title: formData.title,
//       subject: formData.subject,
//       url: formData.url,
//       date: formData.date,
//       topic: formData.title,
//       views: 0,
//       isActive: true,
//     };

//     saveRecording(newRecording);
//     setRecordings([newRecording, ...recordings]);

//     setFormData({
//       title: "",
//       subject: "",
//       url: "",
//       date: new Date().toISOString().split("T")[0],
//       views: 0,
//     });
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">📤 Upload New Recording</h2>
//       <div className="grid gap-4 mb-6">
//         <div>
//           <Label>Title</Label>
//           <Input name="title" value={formData.title} onChange={handleChange} />
//         </div>
//         <div>
//           <Label>Subject</Label>
//           <Input name="subject" value={formData.subject} onChange={handleChange} />
//         </div>
//         <div>
//           <Label>Video URL</Label>
//           <Input name="url" value={formData.url} onChange={handleChange} />
//         </div>
//         <Button onClick={handleUpload}>Upload</Button>
//       </div>

//       <h3 className="text-xl font-semibold mb-3">📚 All Recordings</h3>
//       <div className="grid gap-4 sm:grid-cols-2">
//         {recordings.map((rec) => (
//           <RecordingCard
//             key={rec.id}
//             title={rec.title}
//             subject={rec.subject}
//             date={new Date(rec.date).toLocaleDateString()}
//             fileUrl={rec.url}
//             views={rec.views}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeacherRecording;
