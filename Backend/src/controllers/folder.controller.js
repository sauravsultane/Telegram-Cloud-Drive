const Folder = require('../models/Folder.model');
const File = require('../models/File.model');

const createFolder = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const parentId = parent === 'null' || !parent ? null : parent;

    const folder = await Folder.create({
      name,
      parent: parentId,
      owner: req.user._id,
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating folder' });
  }
};

const getFolders = async (req, res) => {
  try {
    const { parentId = null } = req.query;
    const parent = parentId === 'null' ? null : parentId;

    const folders = await Folder.find({ parent, owner: req.user._id }).sort({ name: 1 });
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching folders' });
  }
};

const renameFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name },
      { new: true }
    );

    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    res.json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error renaming folder' });
  }
};

const deleteFolderRecursive = async (folderId, userId) => {
  // Soft delete all files in this folder
  await File.updateMany({ folderId, owner: userId }, { isDeleted: true });

  // Find child folders
  const childFolders = await Folder.find({ parent: folderId, owner: userId });
  for (const child of childFolders) {
    await deleteFolderRecursive(child._id, userId);
  }

  // Delete the folder itself
  await Folder.findByIdAndDelete(folderId);
};

const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });

    await deleteFolderRecursive(folder._id, req.user._id);

    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting folder' });
  }
};

module.exports = {
  createFolder,
  getFolders,
  renameFolder,
  deleteFolder,
};
