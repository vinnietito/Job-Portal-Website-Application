import multer from "multer";

// Use memory storage for resume uploads (buffer in RAM)
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;