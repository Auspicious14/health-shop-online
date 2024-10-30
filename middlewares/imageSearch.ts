import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export const imageLabelDetection = async (imageUrl: string) => {
  try {
    let imageDescriptions: string[] = [];
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;

    if (labels && labels.length > 0) {
      labels.sort((a, b) => (b.score || 0) - (a.score || 0));

      for (const label of labels) {
        imageDescriptions.push(label.description as string);
      }
    }
    return imageDescriptions;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
