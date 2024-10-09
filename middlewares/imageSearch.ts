import vision from "@google-cloud/vision";

export const imageLabelDetection = async (imageUrl: string) => {
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.labelDetection(imageUrl);
  const labels = result.labelAnnotations;
  console.log("Labels:", labels);

  if (labels && labels.length > 0) {
    labels.sort((a, b) => (b.score || 0) - (a.score || 0));

    const image = labels[0].description;
    return image;
  }

  return null;
};
//   labels!.forEach((label, i) => {
//     console.log(`label ${i}: `, label);
//     imageLabels.push(label.description as string)
//   });
