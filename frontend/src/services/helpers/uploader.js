import {
  attachTokenWithFormAxios,
  formAxios,
} from "../../configs/axios.configs";

export const uploadFileInChunks = async (file) => {
  const chunkSize = 1 * 1024 * 1024; // 1 MBconst
  let totalChunks = Math.ceil(file.size / chunkSize);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunkIndex", i);
    formData.append("totalChunks", totalChunks);
    formData.append("fileName", file.name);
    try {
      attachTokenWithFormAxios();
      let resp = await formAxios.post("uploader/upload-chunk", formData);
      if (i === totalChunks - 1) {
        console.log("File uploaded successfully");
        return resp;
      }
    } catch (err) {
      return err;
      console.log(err);
    }
  }
};
