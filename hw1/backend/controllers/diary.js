import DiaryModel from "../models/diaryModel.js";

// Get all diarys
export const getDiary = async (req, res) => {
    try {
        // Find all diarys
        const diarys = await DiaryModel.find({});

        // Return diarys
        return res.status(200).json(diarys);
    } catch (error) {
        // If there is an error, return 500 and the error message
        // You can read more about HTTP status codes here:
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        // Or this meme:
        // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
        return res.status(500).json({ message: error.message });
    }
};
// Create a Diary
export const createDiary = async (req, res) => {
  const { date, content, image, tag, emotion } = req.body;

  // Check content
  if (!content) {
    return res
      .status(400)
      .json({ message: "Content are required!" });
  }

  // Create a new Diary
  try {
    const newDiary = await DiaryModel.create({
      date,
      content,
      image,
      tag,
      emotion
    });
    return res.status(201).json(newDiary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Update a Diary to DB
export const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { date, content, image, tag, emotion } = req.body;
  try {
    // Check if the id is valid
    const existed_diary = await DiaryModel.findById(id);
    if (!existed_diary) {
      return res.status(404).json({ message: "Diary not found!"});
    }

    // Update the Diary
    if (date !== undefined) existed_diary.date = date;
    if (content !== undefined) existed_diary.content = content;
    if (image !== undefined) existed_diary.image = image;
    if (tag !== undefined) existed_diary.tag = tag;
    if (emotion !== undefined) existed_diary.emotion = emotion;

    // Save the updated Diary
    await existed_diary.save();

    // Rename _id to id
    existed_diary.id = existed_diary._id;
    delete existed_diary._id;

    return res.status(200).json(existed_diary);
  } catch (error) {
    console.error("Error updating diary:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// Delete a diary
export const deleteDiary = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existed_diary = await DiaryModel.findById(id);
    if (!existed_diary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    // Delete the diary
    await DiaryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Diary deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Edit a diary
export const editDiary = async (req, res) => {
  const { id } = req.params;
  const { date, content, image, tag, emotion } = req.body; // Object containing fields to update

  try {
    // Check if the id is valid
    const existed_diary = await DiaryModel.findById(id);
    if (!existed_diary) {
      return res.status(404).json({ message: "Diary not found!" });
    }
    
    // Replace the Diary
    if (date !== undefined) existed_diary.date = date;
    if (content !== undefined) existed_diary.content = content;
    if (image !== undefined) existed_diary.image = image;
    if (tag !== undefined) existed_diary.tag = tag;
    if (emotion !== undefined) existed_diary.emotion = emotion;

    // Save the updated Diary
    await existed_diary.save();

    // Rename _id to id
    existed_diary.id = existed_diary._id;
    delete existed_diary._id;

    return res.status(200).json(existed_diary);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

