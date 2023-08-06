const fs = require("fs").promises;
const path = require("path");
const { parse } = require("node-html-parser");
const { optimize } = require("svgo"); // Import svgo's optimize function
const Helper = require("./helper");


/**
 * Generate an SVG sprite from a list of SVG files
 * @param {Object} options - Options object containing 'files' and 'inputDir'.
 * @param {Array} options.files - Array of SVG file names.
 * @param {string} options.inputDir - Input directory path.
 * @returns {Promise<string>} - SVG sprite content as a string.
 */
async function generateSvgSprite({ files, inputDir }) {
  // Each SVG becomes a symbol, and we wrap them all in a single SVG
  const symbols = await Promise.all(
    files.map(async (file) => {
      const input = await fs.readFile(path.join(inputDir, file), "utf8");
      const clean = input.replace(/stroke="#000000"/g, 'stroke="currentColor"');
      const root = parse(clean);
     
      const svg = root.querySelector("svg");
      if (!svg) throw new Error("No SVG element found");
      svg.tagName = "symbol";
      const iconName = Helper.cleanIconName(file);
      svg.setAttribute("id", iconName);
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xmlns:xlink");
      svg.removeAttribute("version");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      return svg.toString().trim(); // Trim the SVG content
    })
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
    `<defs>`, // for semantics: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
    ...symbols,
    `</defs>`,
    `</svg>`,
  ].join("\n");
}

/**
 * Each write can trigger dev server reloads,
 * so only write if the content has changed
 * @param {string} filepath - Path to the file to write.
 * @param {string} newContent - New content to write.
 * @returns {Promise<void>}
 */
async function writeIfChanged(filepath, newContent) {
  const currentContent = await fs.readFile(filepath, "utf8").catch(() => null); // Catch ENOENT error if file doesn't exist

  if (currentContent !== newContent) {
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    return fs.writeFile(filepath, newContent, "utf8");
  }
}

const iconsDir = "path_to_input_directory"; // Replace with your input directory
const outputDir = ""; // Replace with your output directory

// List all SVG files in the input directory
fs.readdir(iconsDir)
  .then((files) => files.filter((file) => file.endsWith(".svg")))
  .then((svgFiles) =>
    generateSvgSprite({
      files: svgFiles,
      inputDir: iconsDir,
    })
  )
  .then((spritesheetContent) => {
    // Minify the SVG content using svgo's optimize function
    const { data } = optimize(spritesheetContent);
    return data;
  })
  .then((minifiedSpritesheet) =>
    writeIfChanged(path.join(outputDir, "sprite.svg"), minifiedSpritesheet)
  )
  .catch((error) => console.error(error));
