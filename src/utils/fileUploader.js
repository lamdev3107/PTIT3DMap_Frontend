/* eslint-disable no-unused-vars */
//Import Firebase storage config
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "./FirebaseConfig";
import toast from "react-hot-toast";

const fileUploader = (file, type, onUploadSuccess, onUploadProgress) => {
  //   setIsUploading(true);
  //Firebase docs upload file to web: https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=
  let firebasePath = "";
  if (type === "image") firebasePath = "images";
  else if (type === "audio") firebasePath = "audios";
  else firebasePath = "files";

  // Sau prefix firebasePath là filename. Để tránh conflict khi đặt trùng tên file, thêm prefix là ngày tạo (Date.now)-filename)
  const storageRef = ref(storage, `${firebasePath}/${Date.now()}-${file.name}`);

  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onUploadProgress(progress);

      // switch (snapshot.state) {
      //   case "paused":
      //     console.log("Upload is paused");
      //     break;
      //   case "running":
      //     console.log("Upload is running");
      //     break;
      // }
    },
    (error) => {
      console.log("Error Upload: " + error);
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        onUploadSuccess(downloadURL);
      });
    }
  );
};

export const deleteFirebaseItem = (referenceUrl) => {
  const deleteRef = ref(storage, referenceUrl);
  deleteObject(deleteRef)
    .then(() => {
      toast.success("Delete firebase file success");
      return;
    })
    .catch((error) => {
      toast.error("Delete firebase file failed", error);
      return;
    });
};

export default fileUploader;
