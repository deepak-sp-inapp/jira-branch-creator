const APP_NAME = "jira_branch_name_creator";
const REMOVE_STRING = APP_NAME + "remove_string";
const SKIP_LOWER_CASE = APP_NAME + "skip_lower_case";
const ADD_PREFIX = APP_NAME + "add_prefix";

function onLoaded() {
  if (localStorage.getItem(REMOVE_STRING))
    document.getElementById("removeString").value =
      localStorage.getItem(REMOVE_STRING);
  if (localStorage.getItem(SKIP_LOWER_CASE))
    document.getElementById("skipLowercase").value =
      localStorage.getItem(SKIP_LOWER_CASE);
  if (localStorage.getItem(ADD_PREFIX))
    document.getElementById("addPrefix").value =
      localStorage.getItem(ADD_PREFIX);

  onPrefixChange()
}

function onPrefixChange() {
  const addPrefix = document.getElementById("addPrefix").value;
  let perfixHelp = "";

  switch (addPrefix) {
    case "feature/":
      perfixHelp = "A new feature.";
      break;
    case "bugfix/":
      perfixHelp = "A bug fix.";
      break;
    case "docs/":
      perfixHelp = "Documentation only changes.";
      break;
    case "style/":
      perfixHelp = "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).";
      break;
    case "refactor/":
      perfixHelp = "A code change that neither fixes a bug nor adds a feature.";
      break;
    case "test/":
      perfixHelp = "Adding missing or correcting existing tests.";
      break;
    case "chore/":
      perfixHelp = "Changes to the build process or auxiliary tools and libraries such as documentation generation.";
      break;
    default:
      perfixHelp = "";
      break;
  }
  document.getElementById("perfix-help").innerHTML = perfixHelp;
}

function convertToURLString(inputString, substringsToRemove, skipLowercase) {
  let stringWithoutSubstrings = inputString.replace(/[^a-zA-Z0-9]/g, " ");

  substringsToRemove.forEach((substring) => {
    stringWithoutSubstrings = stringWithoutSubstrings.replace(
      new RegExp(`\\b${substring}\\b`, "gi"),
      ""
    );
  });

  const words = stringWithoutSubstrings.split(" ");

  const urlString = words
    .map((word) => {
      if (word.trim() === "") return; // Skip empty strings

      if (word.toLowerCase() === skipLowercase.toLowerCase()) {
        return word;
      } else {
        return word.toLowerCase().replace(/[^\w\s]/gi, "");
      }
    })
    .filter(Boolean) // Filter out undefined, null, and empty strings
    .join("-")
    .trim();
  return urlString;
}

function convertString() {
  const inputString = document.getElementById("inputString").value;
  const removeString = document.getElementById("removeString").value;
  const skipLowercase = document.getElementById("skipLowercase").value;
  const addPrefix = document.getElementById("addPrefix").value;
  const resultElement = document.getElementById("result");

  // save default strings locally
  if (removeString) localStorage.setItem(REMOVE_STRING, removeString);
  if (skipLowercase) localStorage.setItem(SKIP_LOWER_CASE, skipLowercase);
  if (addPrefix) localStorage.setItem(ADD_PREFIX, addPrefix);

  // Split the input of substrings to remove by comma and trim each entry
  const substringsToRemove = removeString
    .split(",")
    .map((substring) => substring.trim());

  const urlString = convertToURLString(
    inputString,
    substringsToRemove,
    skipLowercase
  );

  const resultString = `${addPrefix}${urlString.replace(/^-+|-+$/g, "")}`;
  resultElement.innerHTML = `
    <div class="d-flex justify-content-between align-items-center bg-light rounded p-3">
      <div><b>${resultString}</b></div>
      <div>
        <button class="btn btn-secondary" onclick="copyToClipboard('${resultString}', this)">Copy</button>
      </div>
    </div>
  `;
}

async function copyToClipboard(resultString, copyButton) {
  try {
    await navigator.clipboard.writeText(resultString);
    copyButton.innerHTML = "Copied!";
    copyButton.disabled = true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    copyButton.innerHTML = "Failed to copy!";
    copyButton.disabled = true;
  } finally {
    setTimeout(function () {
      copyButton.innerHTML = "Copy";
      copyButton.disabled = false;
    }, 1500); // Revert back to 'Copy' after 1.5 seconds
  }
}
