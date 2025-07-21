// UploadDownload.js
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000";

const UploadFile = () => {

  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      const res = await axios.post(`${API_BASE}/generate-upload-url`, {
        filename: file.name,
        filetype: file.type,
      });

      await axios.put(res.data.url, file, {
        headers: { "Content-Type": file.type },
      });

      setMessage("File uploaded successfully!");
      setFile(null);
      setFilename("");

    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE}/list-files`); // adjust if your backend is on a different port
      setFiles(response.data || []);
    } catch (err) {
      setError("Failed to load files");
      console.error(err);
    }
  };

  // const downloadFile = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${API_BASE}/generate-download-url/${filename}`
  //     );
  //     window.open(res.data.url, "_blank");
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Download failed.");
  //   }
  // };

  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  useEffect(() => {
    fetchFiles();
  }, []);

  // Function to download the file
  // useEffect(() => {
  //   downloadFile();
  // }, []);


  return (
    <div>
      <h2>S3 File Upload & Download</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
      <p>{message}</p>
      <h3>Uploaded Files:</h3>
      <ul>
        {files && files.map(file => (
          <li key={file.key}>
            {file.size} bytes - {file.key} - {file.lastModified}
            {/* <button onClick={() => downloadFile(file)}>Download</button> */}
          </li>
        ))}
      </ul>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UploadFile;

