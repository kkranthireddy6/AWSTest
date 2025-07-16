const aws = require('aws-sdk');

 aws.config.update({
        accessKeyId: '',
        secretAccessKey: '',
        region: 'us-east-2'
    });

// Initialize the S3 service object
const s3 = new aws.S3();

// Example: Listing all S3 buckets
s3.listBuckets((err, data) => {
    if (err) {
        console.error("Error fetching S3 buckets:", err);
    } else {
        console.log("S3 Buckets:", data.Buckets);
    } 
});


// Example: Uploading a file to an S3 bucket
const params = {
    Bucket: 'iamdemobucket-users',  // Replace with your bucket name
    Key: '/file.txt',  // Replace with the desired key for the file
    Body: 'Hello, this is a test file!'  // Replace with the content of your file or a stream
}  


// Define your parameters for the upload
s3.upload(params, (err, data) => {
    if (err) {  
        console.error("Error uploading file:", err);
    } else {
        if (data && data.Location) {
            console.log("File uploaded successfully at:", data.Location);
        }
    }
});


// Example: Downloading a file from an S3 bucket
const downloadParams = {
    Bucket: 'iamdemobucket-users',  // Replace with your bucket name
    Key: 'path/to/your/file.txt'  // Replace with the key of the file you want to download
};
s3.getObject(downloadParams, (err, data) => {
    if (err) { 
        console.error("Error downloading file:", err);
    } else {
        console.log("File downloaded successfully:", data.Body.toString('utf-8')); // Assuming the file is text
    }
})


// Example: Deleting a file from an S3 bucket
const deleteParams = {
    Bucket: 'iamdemo',  // Replace with your bucket name
    Key: 'path/to/your/file.txt'  // Replace with the key of the file you want to delete
}; 
s3.deleteObject(deleteParams, (err, data) => {
    if (err) {
        console.error("Error deleting file:", err);
    } else {
        console.log("File deleted successfully:", data);
    }
});     


// Example: Listing objects in an S3 bucket
const listParams = {
    Bucket: 'iamdemobucket-users'  // Replace with your bucket name
};
s3.listObjectsV2(listParams, (err, data) => {
    if (err) {
        console.error("Error listing objects:", err);
    } else {
        console.log("Objects in bucket:", data.Contents);
    }
}); 

