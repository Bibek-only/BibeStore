import ImageKit from "imagekit";
import { varible } from "@/schemas/envSchema";
// Initialize ImageKit with configuration
const imagekit = new ImageKit({
  publicKey: varible.IMAGE_KIT_PUBLIC_KEY,

  privateKey: varible.IMAGE_KIT_PRIVATE_KEY,

  urlEndpoint: varible.IMAGE_KIT_URLENDPOINT,
});

export default imagekit;
