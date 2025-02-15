import {
    createContent,
    deleteContentByID, getAllContentsForTree,
    getContentByID,
    getContentByTitle, getContentsByParentID, getRootContents,
    updateContentByID
} from "../models/content.model.js";

export const submitContent = async (req, res) => {
    try {


        const parentID = req.params.parentID;

        const { title, type, icon, can_open, tags, langs, status, text, options_bar, functions_bar } = req.body;

        if (!title || !type || !icon) {
            return res.status(400).json({ message: "Not all required fields are present" });
        }

        const existingContent = await getContentByTitle(title);
        if (existingContent) {
            return res.status(400).json({ message: "Title already exists" });
        }

        const newContent = createContent({ parentID, title, type, icon, can_open, tags, langs, status, text, options_bar, functions_bar });

        res.status(200).json({ message: "Content created", content: newContent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, icon, can_open, tags, langs, status, text, options_bar, functions_bar } = req.body;

        if (!id) {
            return res.status(404).json({ message: "Content Not found", id: id });
        }

        const updatedContent = await updateContentByID(id, {title, type, icon, can_open, tags, langs, status, text, options_bar, functions_bar});

        res.status(200).json({ message: "Content updated", content: updatedContent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: "Content Not found", id: id });
        }

        const deletedContent = await deleteContentByID(id);

        res.status(200).json({ message: "Content deleted", deletedContent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getRootContent = async (req, res) => {
    try {
        const content = await getRootContents();

        return res.status(200).json(content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getFolderContent = async (req, res) => {
    try {
        const { parentID } = req.params;

        if (!parentID) {
            return res.status(404).json({ message: "No ID present"});
        }

        const contents = await getContentsByParentID(parentID);
        return res.status(200).json(contents);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getContentTree = async (req, res) => {
    try {
        const contents = await getAllContentsForTree();

        const tree = [];
        const map = {}

        contents.forEach(item => {
            map[item.id] = { ...item, children: [] };
        });

        contents.forEach(item => {
            if (item.parent_id === null) {
                tree.push(map[item.id]);
            } else {
                map[item.parent_id]?.children.push(map[item.id]);
            }
        });

        return res.status(200).json(tree);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getContent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: "No ID present"});
        }

        const content = await getContentByID(id);
        return res.status(200).json(content);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}