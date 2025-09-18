// const pool = require("./pool.js");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // load environment variables

const client = new Client();

const createCategory = `
CREATE TABLE IF NOT EXISTS categories (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 name TEXT
);

INSERT INTO categories (name)
VALUES ('Fiction'), ('Non-fiction'), ('Self-Help and Personal Development'), ('Science and Technology'), ('Education and Reference');
`;

const createBooks = `
CREATE TABLE IF NOT EXISTS books (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
title TEXT NOT NULL,
author TEXT NOT NULL,
published_year INTEGER,
publisher TEXT,
pages INTEGER,
added TIMESTAMP DEFAULT NOW(),
category INTEGER, 
CONSTRAINT fk_category FOREIGN KEY (category) REFERENCES categories(id)
);

INSERT INTO books (title, author, published_year, publisher, pages, category)
VALUES ('Africa: Altered States, Ordinary Miracles', 'Richard Dowden', 2019, 'Granta Publications', 643, 1),
('The Man Died', 'Wole Soyinka', 1972, 'Spectrum Books Limited', 310, 2),
('Infidel', 'Ayaan Hirsi Ali', 2008, 'Pocket Books', 353, 3),
('This is Marketing', 'Seth Godin', 2018, 'Penguin Business', 267, 4),
('Shoe Dog', 'Phil Knight', 2016, 'Simon and Schuster', 386, 5);
`;
async function main() {
    console.log("Seeding...");
    await client.connect();
    await client.query(createCategory);
    await client.query(createBooks);
    await client.end();
    console.log("Done!");
}

main();
