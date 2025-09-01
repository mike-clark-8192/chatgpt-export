const TurndownService = require('turndown');
const tables = require('turndown-plugin-gfm').tables;
const ts = new TurndownService({
    'hr': '___________',
    'preformattedCode': true,
    'headingStyle': 'setext',
    'codeBlockStyle': 'fenced'
});
ts.use(tables);

// Clone to not modify the actual `document.body` in the code that follows
const cbody = document.body.cloneNode(true);

// Remove code box headers
cbody.querySelectorAll('pre .text-xs').forEach(n => n.remove());

// Remove prompt/response numbers
cbody.querySelectorAll('div .text-xs.gap-1').forEach(n => n.remove());

// Remove footer
cbody.querySelectorAll('.absolute.bottom-0').forEach(n => n.remove());

// properly format code blocks
cbody.querySelectorAll('.text-message pre').forEach((n) => {
    n.innerHTML = n.querySelector('code').outerHTML;
});


/** @param {HTMLAnchorElement} a */
function cleanPillAnchor(a) {
    const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
    if (!walker.nextNode()) return;
    let firstText = walker.currentNode.cloneNode();
    a.childNodes.forEach(n => n.remove());
    a.appendChild(firstText);
}
cbody.querySelectorAll('[data-testid="webpage-citation-pill"] a').forEach(cleanPillAnchor);

// Iterate through main text containers and create text to export
let text = `# ${document.title}\n\n`;
cbody.querySelectorAll('.text-message').forEach((n, i) => {
    const num = Math.trunc(i / 2) + 1;
    const prose = n.querySelector('.prose');
    if (prose) {
        // Only convert response markup to markdown
        text += `## RESPONSE ${num}\n\n${ts.turndown(prose.innerHTML)}\n\n`;
    } else {
        // Keep prompt text as it was entered
        text += `## PROMPT ${num}\n\n${n.querySelector('div').innerText}\n\n`;
    }
});

// Download
const a = document.createElement('a');
a.download = `${document.title}.md`;
a.href = URL.createObjectURL(new Blob([text]));
a.style.display = 'none';
document.body.appendChild(a);
a.click();
