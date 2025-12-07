// Get DOM elements
const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const headingBtn = document.getElementById('headingBtn');
const linkBtn = document.getElementById('linkBtn');
const codeBtn = document.getElementById('codeBtn');
const clearBtn = document.getElementById('clearBtn');

// Configure marked options
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

// Function to update preview
function updatePreview() {
    const markdownText = markdownInput.value;
    const html = marked.parse(markdownText);
    preview.innerHTML = html;
}

// Function to insert markdown syntax
function insertMarkdown(before, after = '', placeholder = '') {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selectedText = markdownInput.value.substring(start, end);
    const text = selectedText || placeholder;

    const newText = before + text + after;
    const beforeText = markdownInput.value.substring(0, start);
    const afterText = markdownInput.value.substring(end);

    markdownInput.value = beforeText + newText + afterText;

    // Set cursor position
    const cursorPos = start + before.length + text.length;
    markdownInput.setSelectionRange(cursorPos, cursorPos);
    markdownInput.focus();

    updatePreview();
}

// Event listeners for toolbar buttons
boldBtn.addEventListener('click', () => {
    insertMarkdown('**', '**', 'bold text');
});

italicBtn.addEventListener('click', () => {
    insertMarkdown('*', '*', 'italic text');
});

headingBtn.addEventListener('click', () => {
    const start = markdownInput.selectionStart;
    const lineStart = markdownInput.value.lastIndexOf('\n', start - 1) + 1;
    const beforeLine = markdownInput.value.substring(0, lineStart);
    const afterLine = markdownInput.value.substring(lineStart);

    markdownInput.value = beforeLine + '## ' + afterLine;
    markdownInput.setSelectionRange(lineStart + 3, lineStart + 3);
    markdownInput.focus();
    updatePreview();
});

linkBtn.addEventListener('click', () => {
    insertMarkdown('[', '](url)', 'link text');
});

codeBtn.addEventListener('click', () => {
    insertMarkdown('`', '`', 'code');
});

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
        markdownInput.value = '';
        updatePreview();
        markdownInput.focus();
    }
});

// Update preview on input
markdownInput.addEventListener('input', updatePreview);

// Load saved content from localStorage
window.addEventListener('load', () => {
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
        markdownInput.value = savedContent;
    }
    updatePreview();
});

// Save content to localStorage
markdownInput.addEventListener('input', () => {
    localStorage.setItem('markdownContent', markdownInput.value);
});

// Handle tab key in textarea
markdownInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        insertMarkdown('    ');
    }
});

// Initial preview update
updatePreview();
