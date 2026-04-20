export const uploadToCloudinary = async (file: File) => {
  // 1. ambil signature
  const sigRes = await fetch(
    `${import.meta.env.VITE_CORE_URL}/cloudinary/signature`,
  );
  const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

  // 2. formdata
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", "baitul-maal");

  // 🚨 DEBUG (optional)
  // for (let pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }

  // 3. upload
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary Error:", data);
    throw new Error(data?.error?.message || "Upload gagal");
  }

  return data; // secure_url
};
