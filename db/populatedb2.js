// const pool = require("./pool.js");
const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // load environment variables

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false,
    },
});

const createCategory = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE
);

INSERT INTO categories (name)
VALUES 
  ('Fiction'),
  ('Non-Fiction'),
  ('Self-Help and Personal Development'),
  ('Science and Technology'),
  ('Business and Economics'),
  ('Education and Reference'),
  ('Spirituality and Religion'),
  ('Health and Wellness'),
  ('Travel and Adventure'),
  ('Arts and Literature'),
  ('Chess');
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
VALUES
  ('Good to great', 'Jim Collins', 2001, 'Random House Business', 301, 5),
  ('This is marketing', 'Seth Godin', 2018, 'Penguin Business', 268, 5),
  ('Steal like an artist', 'Austin Kleon', 2012, 'Workman Publishing company', 152, 2),
  ('Shoe Dog', 'Phil Knight', 2016, 'Simon and Schuster', 386, 2),
  ('The man died', 'Wole Soyinka', 1972, 'Spectrum Books Limited', 310, 2),
  ('Like a Virgin', 'Richard Branson', 2012, 'Virgin Books', 375, 2),
  ('Start with why', 'Simon Sinek', 2011, 'Penguin Business', 246, 3),
  ('OPL 245', 'Mohammed Bello Adoke', 2025, 'The Conrad Press', 271, 2),
  ('The art of war (Translation)', 'Sun Tzu (Translated by John Minford)', 2002, 'Penguin Classics', 454, 3),
  ('Africa: Altered states, Ordinary miracles', 'Richard Dowden', 2008, 'Granta', 643, 2),
  ('Infidel', 'Ayaan Hirsi Ali', 2007, 'Simon and Schuster', 355, 2),
  ('West African Verse', 'Donatus I. Nwoga', 1967, 'Pearson Education', 242, 10),
  ('Nigerian Journal of Geodesy', 'Nigerian Association of Geodesy', 2017, 'Nigerian Association of Geodesy', 238, 6),
  ('Nigeiran Journal of Surveying and Geoinformatics', 'Nigerian Institution of Surveyors', 2016, 'Nigerian Institution of Surveyors', 136, 6),
  ('Fundamentals of Programming using java', 'Edward Currie', 2006, 'Middlesex University Press', 265, 6),
  ('Nigerian Journal of Geodesy', 'Nigerian Association of Geodesy', 2018, 'Nigerian Association of Geodesy', 194, 6),
  ('Higher Surveying', 'Dr A. M. Chandra', 2002, 'New Age International Publishers', 407, 6),
  ('Calculations in Physics', 'G. O. Eweluka', 1998, 'Africana First Publishers Limited', 234, 6),
  ('Railway Engineering', 'S. C. Rangwala', 2004, 'Charotar Publishing House', 401, 6),
  ('Selected Poems: A retrospective', 'Wole Soyinka', 2023, 'Bookcraft', 190, 10),
  ('Stay with me', 'Ayobami Adebayo', 2017, 'Ouida', 306, 10),
  ('Surveying and Geoinformatics', 'F. A. Fajemirokun', 2011, 'Bprint', 623, 6),
  ('50 Military Leaders', 'William Weir', 2007, 'Bounty Books', 259, 9),
  ('Fundamentals of Surveying', 'S. K. Roy', 2011, 'PHI learning Private Limited', 606, 6),
  ('Chess opening essentials', 'Stefan Djuric, Dimitri Komarov, Claudio Pantaleoni', 2007, 'New in chess', 358, 11),
  ('The Holy Quran (with Translation)', 'M.A. Haleem Eliasll', 2000, 'EliasII Family Book Service', 603, 7),
  ('Suatainable environmental management in Nigeria', 'Matt F. A. Ivbijaro, Festus Akintola', 2012, 'BookBuilders', 445, 6),
  ('In Praise of Greatness', 'Toyin Falola', 2019, 'Carolina Academic Press', 1035, 2),
  ('The Thinkers', 'David Llada', 2017, 'Qualtiy Chess', 208, 11),
  ('Outliers', 'Malcom Gladwell', 2008, 'Penguin Books', 365, 2),
  ('I will teach you to be rich', 'Ramit Sethi', 2020, 'Yellow Kite', 336, 3),
  ('The Comic Destiny', 'Ben Okri', 2009, 'Head of Zeus', 177, 10),
  ('How to write reports and Proposals', 'Patrick Forsyth', 2003, 'Kogan Page', 120, 2),
  ('A GIS approach to CIS for Utility management', 'Idowu Olaseni', 2016, 'Femdoc Concepts', 234, 6),
  ('Let''s learn about Wudu, Ghusl and Salah', 'Asim Uysai', 2019, 'Erkham Publishing', 80, 7),
  ('Christainity and Islam', 'Naser Al-Moghamis', 2002, 'Darussalam', 112, 7),
  ('Ireke Onuibudo', 'D. O. Fagunwa', 1949, 'Nelson Publishers', 141, 10),
  ('Introduction to Photogrammetry and Remote Sensing', 'Balogun F. A., Oloyede Kodoko, Ibe P. O.', 2020, 'Adetunji Printing Press', 170, 6),
  ('Atlas of the Heart', 'Brene Brown', 2021, 'Vermilion (Penguin Random House)', 297, 3),
  ('Aditu Olodumare', 'D. O. Fagunwa', 1961, 'Nelson Publishers', 148, 10),
  ('The quick and easy way to effective speaking', 'Dale Carnegie', 1962, 'Pocket Books', 226, 2),
  ('Small Business, Big Money', 'Akin Alabi', 2017, 'Get Altitude Nigeria Ltd', 224, 5),
  ('Love in Cancun', 'Ganiyah Tope Fajingbesi', 2016, 'Ganiyah Tope Fajingbesi', 105, 10),
  ('Awon Oju Odu Merindilogun', 'Wande Abimbola', 2014, 'University Press PLC', 184, 7),
  ('A dictionary of the Yoruba Language', 'University Press PLC', 2008, 'University Press PLC', 242, 6),
  ('Remote Sensing: Principles and Applications', 'Dr. B. C. Panda', 2005, 'Viva Books', 288, 6),
  ('Boko Haram: Inside Nigeria''s Unholy war', 'Mike Smith', 2015, 'I. B. Tauris', 235, 2),
  ('The State of Africa', 'Martin Meredith', 2005, 'Simon and Schuster', 770, 2),
  ('Welcome to Lagos', 'Chibundu Onuzo', 2021, 'Narrative Landscape Press', 359, 10),
  ('Hadith: Muhammed''s Legacy in the Medieval and Modern World', 'Jonathan A.. C. Brown', 2009, 'Oneworld Academic', 354, 7),
  ('The intelligent investor', 'Benjamin Graham', 1973, 'Harper Business', 341, 5),
  ('Of Power and Freedom', 'Wole Soyinka', 2022, 'Bookcraft', 418, 2),
  ('Baba''s Story: Nigeria is 50', 'Abyna Ansaa Adjei', 2010, 'Frangipani', 60, 2),
  ('Basic Economics', 'Thomas Sewell', 2015, 'Basic Books', 689, 5),
  ('Isara', 'Wole Soyinka', 2014, 'Bookcraft', 315, 10),
  ('Studying poetry', 'Stephen Matterson, Darryl Jones', 2011, 'Bloomsbury Academic', 200, 6),
  ('Ake: The years of childhood', 'Wole Soyinka', 1981, 'Spectrum Books Limited', 230, 10),
  ('Trump', 'Donald Trump, Bill Zanker', 2007, 'Collins Business', 369, 2),
  ('Never lost again', 'Bill Kilday', 2018, 'Harper Business', 349, 2),
  ('The President Explains', 'Sola Ojewusi', 2011, 'Sola Ojewusi and Associates', 390, 2),
  ('Nineteen Eighty-Four', 'George Orwell', 1954, 'Penguin Books', 378, 1),
  ('Leaving the Tarmac', 'Aigboje Aig-Imoukhuede', 2021, 'RedDoor', 217, 2),
  ('Hayatus Sahabah', 'Hadhrat Moulana Muhammad Yusuf Kandhelwi', 2000, 'Zam Zam Publishers', 703, 7),
  ('The Laws of Human Nature', 'Robert Greene', 2018, 'Viking (Penguin Random House)', 609, 2),
  ('The 21 Irrefutable laws of leadership', 'John C. Maxwell', 1998, 'Thomas Nelson', 313, 2),
  ('Snapsongs', 'Niyi Osundare', 2021, 'University Press PLC', 116, 10),
  ('My command', 'Olusegun Obasanjo', 1980, 'Kachifo Limited', 268, 2),
  ('Speak with Power and Confidence', 'Patrick Collins', 2009, 'Mindex Publishing', 234, 2),
  ('The little book on meaningful living', 'Francis Ehiabhi', 2022, 'Zayzee Limited', 82, 2),
  ('In Search of Equilibrium', 'Theresa Lola', 2019, 'Nine Arches Press', 59, 10),
  ('Madmen and Specialists', 'Wole Soyinka', 1971, 'Oxford University Press', 77, 10),
  ('How to win friends and influence people', 'Dale Carnegie', 1953, 'Vermilion (Penguin Random House)', 280, 2),
  ('Psychology from the Islamic Perspective', 'Dr. Aisha Utz', 2011, 'International Islamic Publishing House', 351, 7),
  ('12 Rules for Life', 'Jordan B. Peterson', 2018, 'Penguin Random House', 411, 3),
  ('Crime and Punishment', 'Fyodor Dostoyevsky', 2014, 'Penguin Books', 702, 1),
  ('Digital: The new code of wealth', 'J.J. Omojuwa', 2019, 'A''Lime Media Limited', 356, 2),
  ('Alex Ferguson: My autobiography', 'Alex Ferguson', 2013, 'Hodder and Stoughton', 429, 2),
  ('The Lords of Strategy', 'Walter Kiechel II', 2010, 'Havard Business Press', 348, 2),
  ('I am Because we are', 'Chidiogo Akunyili-Parr', 2022, 'Safari Books', 389, 2),
  ('Beyond good and evil', 'Friedrich Nietzsche', 1973, 'Penguin Books', 306, 2),
  ('Sorosoke: An endsars anthology', 'Jumoke Verissimo, James Yeku', 2022, 'Noirledge Limited', 110, 10),
  ('Memory and the call of Waters', 'S.Su''eddie Vershima Agema', 2021, 'Sevhage', 98, 10),
  ('The Business of the 21st century', 'Robert T. Kiyosaki', 2010, 'DreamBuilders', 121, 5),
  ('Steps to the top', 'Zig Ziglar', 1985, 'Pelican', 239, 3),
  ('The archetypes and the collective unconscious', 'Carl Jung', 1959, 'Routledge', 451, 2),
  ('Dreams from my father', 'Barrack Obama', 2016, 'Canongate', 442, 2),
  ('Brave New World', 'Aldous Huxley', 2014, 'Vintage Books', 230, 1),
  ('Dear Ijeawele, Or a feminist manifesto in fifteen suggestions', 'Chimamanda Ngozi Adichie', 2017, 'Farafina', 55, 2),
  ('Features of Yoruba Oral Poetry', 'Olatunde O Olatunji', 2005, 'University Press PLC', 267, 6),
  ('Awo: The autobiography of chief Obafemi Awolowo', 'Obafemi Awolowo', 1960, 'Cambridge University Press', 316, 2),
  ('Introduction to Photogrammetry and Remote Sensing Vol I', 'Balogun F. A.,Egenamba, J.N, Ibe P. O.', 2016, 'Gabtony Prints Limited', 125, 6),
  ('The History of Astronomy', 'Michael Hoskin', 2003, 'Oxford', 123, 6),
  ('Anthills of the Savannah', 'Chinua Achebe', 1987, 'Penguin Books', 222, 1),
  ('Blink', 'Malcom Gladwell', 2005, 'Back Bay Books', 287, 2),
  ('Ijapa Tiroko Oko Yannibo', 'Olagoke Ojo', 1973, 'Ijapa Tiroko Oko Yannibo', 126, 1),
  ('A play of Giants', 'Wole Soyinka', 1984, 'Spectrum Books Limited', 69, 1),
  ('Wanderer Cantos', 'Remi Raji', 2021, 'Noirledge Limited', 101, 10),
  ('Elevate your expressions', 'Craig O. Esohwode', 2022, 'Craig''s Communication clinic', 84, 2),
  ('Readings in Research and Methodology', 'P.C. Nnabude, Anayo D, Nkamnebe, M.O. Ezenwa', 2009, 'Rex Charles and Patrick Limited', 213, 6);
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
