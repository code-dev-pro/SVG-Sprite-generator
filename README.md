# SVG Sprite Generator

This Node.js script generates an SVG sprite from a list of SVG files. It reads SVG files from a specified input directory, converts each SVG file into a symbol, and wraps all symbols in a single SVG sprite. The resulting SVG sprite is then optimized using SVGO and written to the output directory.

## Requirements

- Node.js (>= 12.0.0)

## Dependencies

- fs (File System) - Node.js built-in module to handle file operations like reading and writing files asynchronously using promises.

- path - Node.js built-in module to manipulate file paths.

- node-html-parser (version x.x.x) - An npm package used for parsing and manipulating HTML and SVG documents.

- svgo (version x.x.x) - An npm package for optimizing SVG files.


## Installation

1. Clone this repository or download the script (`generate-svg-sprite.js`) to your project directory.

2. Install dependencies by running the following command in your project directory:


## Usage

1. Put your individual SVG files in a directory of your choice. For example, create a directory named `icons` and place all your SVG files in it.

2. Modify the `iconsDir` variable in the `generate-svg-sprite.js` file to specify the path to your input directory (the directory containing your SVG files).

3. If you want to specify an output directory, modify the `outputDir` variable in the `generate-svg-sprite.js` file. If you leave it empty (`outputDir = ""`), the generated sprite will be saved in the same directory as the script.

4. Open a terminal or command prompt, navigate to your project directory containing the `generate-svg-sprite.js` file.

5. Run the script using Node.js with the following command:


`node generate-svg-sprite.js`

The script will read all SVG files from the input directory, generate an SVG sprite, optimize it, and save it in the specified output directory.

## Customize

If you want to use the generated SVG sprite in your react, you can link to it using an `<svg>` element like this:

## Sandbox

[CodeSandbox Project](https://codesandbox.io/s/suspicious-cdn-3x66wx?file=/src/Icon.tsx:0-278)



## Generate PDF Sprite from SVG Icons

The `generate-pdf-sprite` script is a Node.js tool designed to generate a PDF sprite sheet from a collection of SVG icons. A PDF sprite sheet is a single PDF file containing multiple SVG icons arranged in a grid format. This sprite sheet can be used in web development, particularly in scenarios where you want to load and display multiple icons efficiently with a single HTTP request.

### Dependencies

Before using the `generate-pdf-sprite` script, make sure you have the following dependencies installed:

- [Node.js](https://nodejs.org): Ensure you have Node.js installed on your system.

- [fs](https://nodejs.org/api/fs.html): Built-in Node.js module for interacting with the file system.

- [path](https://nodejs.org/api/path.html): Built-in Node.js module for working with file and directory paths.

- [pdfkit](https://www.npmjs.com/package/pdfkit): A library for creating PDF documents in Node.js.

- [convert-svg-to-png](https://www.npmjs.com/package/convert-svg-to-png): A library for converting SVG images to PNG format.


### How It Works

1. **SVG to PNG Conversion**: The script first converts each SVG icon to PNG format using the `convert-svg-to-png` library. This conversion is essential as PNG images are better suited for printing in PDF documents.

2. **Cleaning Icon Names**: Before creating the sprite sheet, the script cleans up the icon names to ensure consistency and better display. Icon names containing numbers, spaces, or special characters are sanitized to have only alphanumeric characters and underscores.

3. **Arranging Icons in Grid**: The cleaned icons are then arranged in a grid format within the PDF sprite sheet. The number of icons per row is determined based on the specified page width, icon size, and spacing between icons.

4. **Creating the PDF Sprite Sheet**: The script uses the `pdfkit` library to create a new PDF document. Each icon, along with its cleaned name, is added to the PDF grid, creating a sprite sheet with icons neatly organized in rows and columns.

### How to Use

1. Ensure you have Node.js installed on your system.

2. Clone this repository and navigate to its root directory.

3. Install the required dependencies by running `npm install`.

4. Place your SVG icons in a directory of your choice. Update the `iconsDir` variable in the `generate-pdf-sprite.js` script with the path to your input directory.

5. Customize the `pageWidth`, `iconSize`, and `spacing` variables in the script to fit your needs. These variables control the size and layout of the sprite sheet.

6. Run the script by executing the command `node generate-pdf-sprite.js`.

7. The script will generate a PDF sprite sheet named `icons_grid.pdf` in the same directory.


### License

This script is provided under the [MIT License](LICENSE).

Feel free to use, modify, and distribute this script according to the terms of the MIT License.

If you encounter any issues or have suggestions for improvements, please create an issue or submit a pull request on the GitHub repository.

Enjoy creating efficient and visually appealing sprite sheets for your web projects!
