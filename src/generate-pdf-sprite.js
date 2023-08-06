const fs = require("fs");
const path = require("path");
const SVGtoPDF = require("pdfkit");
const convertSvgToPng = require("convert-svg-to-png");
const { promisify } = require("util");

// Promisify some fs functions for easier use with async/await
const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);


const iconsDir = "path_to_input_directory"; // Replace with your input directory
const pageWidth = 612; // Width of the PDF page in points (8.5 inches)
const iconSize = 24; // Width and height of the icons in points
const spacing = 60; // Spacing between icons in points

// Calculate the number of columns based on the page width, icon size, and spacing
const columns = Math.floor((pageWidth - spacing) / (iconSize + spacing));

// Function to convert SVG to PNG using convert-svg-to-png library
async function svgToPng(svgContent) {
  const options = {
    width: iconSize, // Specify the width of the SVG
    height: iconSize, // Specify the height of the SVG
    puppeteer: { args: ["--no-sandbox"] }, // Optional puppeteer arguments to avoid sandbox issues
  };
  const pngBuffer = await convertSvgToPng.convert(svgContent, options);
  return pngBuffer;
}

// Function to add an icon to the PDF grid
async function addIconToGrid(pdfDoc, x, y, iconFile, pngCache) {
  const iconPath = path.join(iconsDir, iconFile);
  const svgContent = await readFileAsync(iconPath, "utf8");

  // Check if the PNG data is already cached
  let pngBuffer = pngCache.get(iconFile);
  if (!pngBuffer) {
    pngBuffer = await svgToPng(svgContent);
    pngCache.set(iconFile, pngBuffer);
  }

  // Convert PNG buffer to Data URL
  const imgData = `data:image/png;base64,${pngBuffer.toString("base64")}`;
  const fontSize = 8;
  const options = { width: iconSize, height: iconSize };
  pdfDoc.image(imgData, x, y, options);

  // Remove the .svg extension and clean up the icon name
  const iconName = iconFile.replace(".svg", "");
  const iconNameWithoutNumbers = iconName.replace(/\d+/g, "").trim();

  // Calculate the horizontal position for centering the text under the icon
  const textWidth = pdfDoc.widthOfString(iconNameWithoutNumbers);
  const textX = x + (iconSize - textWidth) / 2;

  // Add the cleaned-up icon name under the icon
  pdfDoc.fontSize(fontSize).text(iconNameWithoutNumbers, textX, y + iconSize + 5);

  // Move to the next position
  pdfDoc.moveDown();
}

// Create a new PDF document
const pdfDoc = new SVGtoPDF();
pdfDoc.pipe(fs.createWriteStream("icons_grid.pdf"));

// List all SVG files in the input directory
readdirAsync(iconsDir)
  .then(async (files) => {
    // Filter out files containing numbers in their names
    const filteredFiles = files.filter((file) => !/\d/.test(file));

    // Sort the filtered files in alphabetical order
    const sortedFiles = [...filteredFiles].sort((a, b) => a.localeCompare(b));

    // Create a cache to store PNG data for faster access
    const pngCache = new Map();

    // Loop through the SVG files and add them to the PDF grid
    const addIconPromises = sortedFiles.map((file, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = col * (iconSize + spacing) + spacing;
      const y = row * (iconSize + spacing) + spacing;

      return addIconToGrid(pdfDoc, x, y, file, pngCache);
    });

    // Wait for all icons to be added to the PDF grid
    await Promise.all(addIconPromises);

    // Finalize the PDF document
    pdfDoc.end();
    console.log("PDF generated successfully!");
  })
  .catch((err) => {
    console.error("Error reading SVG files:", err);
  });
