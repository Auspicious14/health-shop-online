import vision from "@google-cloud/vision";

export const imageSearchApi = async (imageUrl: string) => {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.labelDetection(imageUrl);
  const labels = result.labelAnnotations;
  console.log("Labels:", labels);

  labels!.forEach((label, i) => {
    console.log(`label ${i}: `, label);
    return label.description;
  });
};
