import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { GoogleAuth } from "google-auth-library";

const client = new SecretManagerServiceClient();

async function accessSecret(secretName: string) {
  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/vendify-438111/secrets/${secretName}/versions/latest`,
    });
    if (version) {
      const payload = version?.payload?.data?.toString();
      return payload;
    }
  } catch (error) {
    throw error;
  }
}

export async function loadSecrets() {
  process.env.PORT = await accessSecret("PORT");
  process.env.CLOUDINARY_KEY = await accessSecret("CLOUDINARY_KEY");
  process.env.CLOUDINARY_NAME = await accessSecret("CLOUDINARY_NAME");
  process.env.CLOUDINARY_SECRET = await accessSecret("CLOUDINARY_SECRET");
  process.env.EMAIL_USERNAME = await accessSecret("EMAIL_USERNAME");
  process.env.EMAIL_PASSWORD = await accessSecret("EMAIL_PASSWORD");
  process.env.JWT_SECRET = await accessSecret("JWT_SECRET");
  process.env.MONGODB_URL = await accessSecret("MONGODB_URL");
  process.env.NODE_ENV = "production";
  process.env.NODE_VERSION = "18.16.0";
  process.env.PAYSTACK_KEY = await accessSecret("PAYSTACK_KEY");
  process.env.PAYSTACK_SECRET = await accessSecret("PAYSTACK_SECRET");

  const googleCredentialsJson: any = await accessSecret(
    "GOOGLE_APPLICATION_CREDENTIALS"
  );
  const googleCredentials = JSON.parse(googleCredentialsJson);

  const auth = new GoogleAuth({
    credentials: googleCredentials,
  });

  return auth;
}

// console.log(loadSecrets().then((res) => console.log("ressss", res)));
