// Helper function to fetch and parse Markdown files
async function fetchMarkdownFiles(folderPath) {
    try {
        // Fetch the list of Markdown files
        const response = await fetch(folderPath);
        const text = await response.text();

        // Parse and extract file paths (only works if Netlify serves directory listings or with a static list)
        const parser = new DOMParser();
        const html = parser.parseFromString(text, "text/html");
        const fileLinks = [...html.querySelectorAll("a")]
            .map(a => a.href)
            .filter(href => href.endsWith(".md"));

        // Fetch and parse each Markdown file
        const markdownPromises = fileLinks.map(file =>
            fetch(file)
                .then(res => res.text())
                .then(content => parseMarkdown(content))
        );

        return Promise.all(markdownPromises);
    } catch (error) {
        console.error("Error fetching markdown files:", error);
        return [];
    }
}

// Helper function to parse Markdown content
function parseMarkdown(markdown) {
    const [metadataBlock, ...contentLines] = markdown.split("---").slice(1);
    const metadata = {};
    const content = contentLines.join("---");

    // Extract metadata
    metadataBlock.split("\n").forEach(line => {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts) {
            metadata[key.trim()] = valueParts.join(":").trim();
        }
    });

    return { metadata, content };
}

// Render poetry content into the page
async function renderPoetry() {
    const poetryContainer = document.querySelector(".poem-list");
    const poems = await fetchMarkdownFiles("content/poetry/");

    poems.forEach(({ metadata, content }) => {
        const poemDiv = document.createElement("div");
        poemDiv.innerHTML = `
            <h3>${metadata.title || "Untitled"}</h3>
            <p>${metadata.date || ""}</p>
            <pre>${content.trim()}</pre>
        `;
        poetryContainer.appendChild(poemDiv);
    });
}

// Render prose content into the page
async function renderProse() {
    const proseContainer = document.querySelector(".prose-list");
    const chapters = await fetchMarkdownFiles("content/prose/");

    chapters.forEach(({ metadata, content }) => {
        const proseDiv = document.createElement("div");
        proseDiv.innerHTML = `
            <h3>${metadata.title || "Untitled"}</h3>
            <p>${metadata.date || ""}</p>
            <pre>${content.trim()}</pre>
        `;
        proseContainer.appendChild(proseDiv);
    });
}

// Initialize content rendering based on the page
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".poem-list")) {
        renderPoetry();
    }
    if (document.querySelector(".prose-list")) {
        renderProse();
    }
});
