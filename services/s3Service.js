const { S3 } = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const AWS = require("aws-sdk");

exports.s3Uploadv2 = async (files) => {
  AWS.config.update({
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();

  const params = files.map((file) => {
    return {
      Bucket: process.env.BUCKET_NAME,
      Key: `uploads/${uuid()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  });

  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};

// exports.s3Uploadv3 = async (files) => {
//   const s3client = new S3Client();

//   const params = files.map((file) => {
//     return {
//       Bucket: process.env.BUCKET_NAME,
//       Key: `uploads/${uuid()}-${file.originalname}`,
//       Body: file.buffer,
//     };
//   });

//   return await Promise.all(
//     params.map((param) => s3client.send(new PutObjectCommand(param)))
//   );
// };
