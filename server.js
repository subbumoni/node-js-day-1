

const express = require("express");
// Used to parse json payloads in incoming request, make it available in req.body
const bodyParser = require("body-parser");
// file operations => create, read folder, folder/file exist or not
const fs = require("fs-extra");
// Manage file and directory path
const path = require("path");

const app = express();
const PORT = 3000;

// creating texts folder in current directory
const folderPath = path.join(__dirname, "texts");

// check whether the folder is there or not
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// function to remove colon and dot from filename
function getFormattedFileName() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

//endpoint to create a text file
app.post("/createFile", async (req, res) => {
  try {
    await fs.ensureDir(folderPath);
    // function to get formatted date and time
    const time = getFormattedFileName();
    // Creating file name as time.txt
    const fileName = `${time}.txt`;
    // joining folderpath and filename
    const filePath = path.join(folderPath, fileName);

    // Write the file with the current time as content
    await fs.writeFile(filePath, time);
    res.send("File created successfully!!!");
  } catch (error) {
    console.error("Error writing a file:", error);
    res.status(500).send("Error writing a file - ", error); // to handle error if post method fails
  }
});

//Endpoint to retrieve all text files
app.get("/getFiles", async (req, res) => {
  try {
    await fs.ensureDir(folderPath); // making sure the folder path is available
    const files = await fs.readdir(folderPath); // reading the folder path
    const textFiles = files.filter((file) => file.endsWith(".txt")); // filtering the .txt files using filter method
    res.json(textFiles); // sending the text files as json response
  } catch (error) {
    console.error("Error Reading a file:", error);
    res.status(500).send("Error Reading files - ", error); // to handle error if get method fails
  }
});

// server connection
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});