export async function parseBundle(bundle: string) {
  // parse bundle into a map of file names and their contents
  const files = new Map<string, string>();
  const regex = /\n([^\n]*?)\n```([^\n]*?)\n(.*?)\n```\n/gs;
  let match;

  while ((match = regex.exec("\n" + bundle + "\n")) !== null) {
    const [fileName] = match[1].split(" ");
    const fileContent = match[3].trim() + "\n";
    if (fileName && fileContent) files.set(fileName, fileContent);
  }

  return files;
}
