import pool from "../config/db.js";

export const createContent = async ({parentID = null, title, type, icon, can_open = false, tags = [], langs = [], status = [], text = null, options_bar = false, functions_bar = false}) => {
    const query = `
        INSERT INTO contents (parent_id, title, type, icon, can_open, tags, langs, status, text, options_bar, functions_bar)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
    `;

    const values = [
        parentID,
        title,
        type,
        icon,
        can_open,
        tags.length ? tags : null,
        langs.length ? langs : null,
        status.length ? status : null,
        text,
        options_bar,
        functions_bar
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const updateContentByID = async (id, updates) => {
    const allowedFields = ["title", "type", "icon", "can_open", "tags", "langs", "status", "text", "options_bar", "functions_bar"];
    const setClauses = [];
    const values = [];

    Object.keys(updates).forEach((key, index) => {
        if (allowedFields.includes(key)) {
            setClauses.push(key);
            values.push(updates[index]);
        }
    });

    if (setClauses.length === 0) {
        throw new Error("No valid fields to update.");
    }

    const query = `UPDATE contents SET (${setClauses.join(', ')}) = (${values.join(', ')}) WHERE id = ${id} RETURNING *;`;

    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const deleteContentByID = async (id) => {
    const query = `DELETE FROM contents WHERE id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
        throw new Error(`Content with ID ${id} not found.`);
    }

    return rows[0];
};

export const getContentByID = async (id) => {
    const query = `SELECT * FROM contents WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
}

export const getContentByTitle = async (title) => {
    const query = `SELECT * FROM contents WHERE title = $1;`;
    const { rows } = await pool.query(query, [title]);
    return rows[0];
}

export const getContentsByParentID = async (id) => {
    const query = `SELECT * FROM contents WHERE parent_id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows;
}

export const getRootContents = async () => {
    const query = `SELECT * FROM contents WHERE parent_id IS NULL`;
    const { rows } = await pool.query(query);
    return rows;
}

export const getAllContentsForTree = async () => {
    const query = `SELECT id, parent_id, title, icon FROM contents`;
    const { rows } = await pool.query(query);
    return rows;
}