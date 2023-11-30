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
    const resultElement = document.getElementById("result");

    // Split the input of substrings to remove by comma and trim each entry
    const substringsToRemove = removeString
        .split(",")
        .map((substring) => substring.trim());

    const urlString = convertToURLString(
        inputString,
        substringsToRemove,
        skipLowercase
    );

    const resultString = `${urlString.replace(/^-+|-+$/g, "")}`;
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
