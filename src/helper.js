class Helper {
  static cleanIconName(name) {
    // Remove extension and replace spaces, special characters, and leading numbers with underscores
    return name
      .replace(/\.svg$/, "")
      .replace(/\d+/g, "")
      .toLowerCase();
  }
}

module.exports = Helper;
