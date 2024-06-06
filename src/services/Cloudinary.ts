const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY;

export const uploadUserAvatar = async (file: File) => {
  //upload to cloudinary and return file url
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("upload_preset", "attendance");
  form.append("cloud_name", "dr5nmuou0");
  form.append("folder", "users_avatars");

  const result = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: form,
  });
  const data = await result.json();
  console.log(data);
  return data?.secure_url;
};
