// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Endpoint to generate a pre-signed URL for uploading files to S3
// Generate pre-signed URL for upload
app.post('/generate-upload-url', async (req, res) => {
  const { filename, filetype } = req.body;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    ContentType: filetype,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Error generating upload URL' });
  }
});

// Endpoint to get a list of files in the S3 bucket
app.get('/list-files', async (req, res) => {
    // List objects in the S3 bucket
  const command = new ListObjectsV2Command({    
    Bucket: process.env.S3_BUCKET_NAME,
  }); 

  try{
    const data = await s3.send(command);
    const files = data.Contents.map(file => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
    }));
    res.json(files);  
  } catch (error) {
    res.status(500).json({ error: 'Error listing files' });
  }  
});


// Endpoint to generate a pre-signed URL for downloading files from S3
// Note: Ensure that the file exists in the S3 bucket before generating the download URL
// Generate pre-signed URL for download
// app.get('/generate-download-url/:filename', async (req, res) => {
//   const { filename } = req.params;

//   const command = new GetObjectCommand({
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: filename,
//   });

//   try {
//     const url = await getSignedUrl(s3, command, { expiresIn: 60 });
//     res.json({ url });
//   } catch (error) {
//     res.status(500).json({ error: 'Error generating download URL' });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
