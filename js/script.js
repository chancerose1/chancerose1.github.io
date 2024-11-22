const input = document.getElementById('input');
const output = document.getElementById('output');
const cursor = document.getElementById('cursor');

const dirTree = {
    'welcome': ['projects', 'resume', 'AboutMe.txt'],
    'projects': ['embedded', 'web', 'READ.txt'],
    'embedded': ['WIoT'],
    'web': ['vermontirrigation', 'wastewatch', 'nytimes_puzzle_solvers'],
};
const dirs = ['welcome', 'projects', 'embedded', 'web'];
const links = ['WIoT', 'vermontirrigation', 'wastewatch', 'nytimes_puzzle_solvers'];
let curDir = 'welcome';

window.onload = function () {
    const header = document.getElementById("name-text");
    const msg = document.getElementById('msg-text');
    const cmdLine = document.getElementById('command-line');
    if (window.matchMedia("(max-width: 768px)").matches) {
        msg.innerText = "Thanks for visiting my website!\nYou are reading this on a phone or tablet, but this site is intentionally designed for a laptop or desktop.\nPlease visit again soon!\n-Chance"
        msg.style.textAlign = 'center';
        cmdLine.style.display = 'none';
        return;
    }
    console.log("document load function running");
    fetch('js/assets/header.txt')
        .then(response => response.text())
        .then(text => {
            header.innerText = text;
            header.style.color = 'greenyellow';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    fetch('js/assets/welcomemsg.txt')
        .then(response => response.text())
        .then(text => {
            msg.innerText = text;

        })
        .catch(error => console.error('Error:', error));
}

function handleLink(result, newElement) {
    const actions = {
        'WIoT': 'https://github.com/chancerose1/wiot-s24-g10.git',
        'vermontirrigation': 'http://vermontirrigation.com/',
        'wastewatch': 'https://wastewatch-e2cb8be1b76d.herokuapp.com/',
        'nytimes_puzzle_solvers': 'https://github.com/chancerose1/nytgames.git'
    }
    const link = document.createElement('a');
    link.innerText = result;
    link.href = actions[result];
    link.style.color = 'cyan';
    link.style.textDecoration = 'underline';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    newElement.appendChild(link);
}

function handleLS(output, cmdLine) {
    const results = dirTree[curDir];
    if (results) {
        const newLine = document.createElement('div');
        newLine.id = 'ls-return-div';
        for (const result of results) {
            console.log(result);
            const newElement = document.createElement('code');
            if (result === 'resume') {
                const resumeLink = document.createElement('a');
                resumeLink.innerText = result;
                resumeLink.href = 'js/assets/files/chanceroseresume.pdf';
                resumeLink.style.color = 'cyan';
                resumeLink.style.textDecoration = 'underline';
                resumeLink.download = 'Chance_Rose_Resume.pdf';
                newElement.appendChild(resumeLink);
            } else if (links.includes(result)) {
                handleLink(result, newElement);
            }
            else {
                newElement.innerText = result;
                if (dirs.includes(result)) {
                    newElement.style.color = 'red';
                }
            }
            newLine.appendChild(newElement);
        }
        output.insertBefore(newLine, cmdLine);
    }
    else {
        const newElement = document.createElement('code');
        newElement.innerText = "Nothing to see here, empty dir...";
        output.insertBefore(newElement, cmdLine);
    }
    const br = document.createElement('br');
    output.insertBefore(br, cmdLine);
}

function handleCD(output, cmdLine, cmdArgs) {
    if (cmdArgs.length === 1 || cmdArgs[1] === '') {
        curDir = 'welcome';
        const cmdLineText = document.querySelector('#command-line > code:first-child');
        cmdLineText.textContent = `visitor@chancerose1.github.io/${curDir}$ `;
        return;
    }
    const destDir = cmdArgs[1];
    if (dirTree[curDir].includes(destDir)) {
        curDir = destDir;
        const cmdLineText = document.querySelector('#command-line > code:first-child');
        cmdLineText.textContent = `visitor@chancerose1.github.io/${curDir}$ `;
        return;
    }
    if (destDir === '../' || destDir === '..') {
        for (const [key, value] of Object.entries(dirTree)) {
            if (value.includes(curDir)) {
                curDir = key;
                const cmdLineText = document.querySelector('#command-line > code:first-child');
                cmdLineText.textContent = `visitor@chancerose1.github.io/${curDir}$ `;
                return;
            }
        }
        const newLine = document.createElement('code');
        newLine.textContent = `==> Error: Already at the root directory.`;
        newLine.classList.add('no-indent');
        newLine.style.color = 'red';
        output.insertBefore(newLine, cmdLine);
        return;
    }
    else {
        const newLine = document.createElement('code');
        newLine.textContent = `==> Error: ${destDir} is not an available directory.`;
        newLine.classList.add('no-indent');
        newLine.style.color = 'red';
        output.insertBefore(newLine, cmdLine);
    }

}

function handleCAT(output, cmdLine, cmdArgs) {
    if (cmdArgs.length === 1 || cmdArgs[1] === '') {
        const termError = document.createElement('code');
        termError.textContent = `==> Usage: cat <file_name>`;
        termError.classList.add('no-indent');
        termError.style.color = 'red';
        output.insertBefore(termError, cmdLine);
        return;
    }
    const file = cmdArgs[1];
    const curDirFiles = dirTree[curDir].map(f => f.toLowerCase());
    console.log(curDirFiles);
    if (!curDirFiles.includes(file)) {
        const termError = document.createElement('code');
        termError.textContent = `==> Error: ${file} not found.`;
        termError.classList.add('no-indent');
        termError.style.color = 'red';
        output.insertBefore(termError, cmdLine);
        return;
    }
    if (dirs.includes(file)) {
        const termError = document.createElement('code');
        termError.textContent = `==> Error: ${file} is a directory.`;
        termError.classList.add('no-indent');
        termError.style.color = 'red';
        output.insertBefore(termError, cmdLine);
        return;
    }
    const newLine = document.createElement('code');
    const br = document.createElement('br');
    const result = fetch(`js/assets/files/${file}`)
        .then(response => response.text())
        .then(text => {
            newLine.innerText = text;
            output.insertBefore(newLine, cmdLine);
        }).catch(error => console.error(error));
}


function handleCLEAR(output, cmdLine) {
    const children = Array.from(output.children);
    children.forEach(child => {
        if (child.id !== 'name-text' && child.id !== 'msg-text' && child !== cmdLine) {
            output.removeChild(child);
        }
    });
}

function handlePETA() {
    var modal = document.getElementById("pg-modal");
    const pg = document.getElementById('pg-img');
    modal.style.display = 'flex';
    let angle = 0;
    const rotationInterval = setInterval(() => {
        angle += 1;
        pg.style.transform = `rotate(${angle}deg)`;
    }, 20);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.display = "none";
            clearInterval(rotationInterval);
        }
    });
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            clearInterval(rotationInterval);
        }
    }
}

function handleHELP(output, cmdLine) {
    const options = document.createElement('code');
    options.textContent = `Commands Available: \n
    --- help\n
    --- ls - lists contents of directory\n
    --- cd - change directory\n
    --- cat - print a file's contents (use on .txt)\n
    --- clear - clear previous output\n
    Directories are in red text, files in green, links in blue.`;
    options.classList.add('no-indent');
    output.insertBefore(options, cmdLine);
}

function handleCommand(command) {
    console.log("handling command");
    const cmdLine = document.getElementById('command-line');
    const output = document.getElementById('output');
    const newLine = document.createElement('code');
    newLine.textContent = `visitor@chancerose1.github.io/${curDir}$ ${command}`;
    newLine.classList.add('no-indent');
    output.insertBefore(newLine, cmdLine);
    const br = document.createElement('br');
    output.insertBefore(br, cmdLine);
    const cmdArgs = command.toLowerCase().split(" ");
    const cmd = cmdArgs[0];
    console.log(cmd);
    switch (cmd) {
        case 'help':
            handleHELP(output, cmdLine);
            break;
        case 'ls':
            handleLS(output, cmdLine);
            break;
        case 'cd':
            handleCD(output, cmdLine, cmdArgs);
            break;
        case 'cat':
            handleCAT(output, cmdLine, cmdArgs);
            break;
        case 'clear':
            handleCLEAR(output, cmdLine);
            break;
        case 'peta':
            handlePETA();
            break;
        default:
            const termError = document.createElement('code');
            termError.textContent = `==> Error: ${command} is not a valid command on this system...`;
            termError.classList.add('no-indent');
            termError.style.color = 'red';
            output.insertBefore(termError, cmdLine);
            break;
    }
    cmdLine.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

input.addEventListener('focus', () => {
    input.style.outline = 'none';
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.value;
        handleCommand(command);
        input.value = '';
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        const userInput = input.value.trim();
        const tokens = userInput.split(' ');

        if (tokens[0] === 'cd' && tokens[1]) {
            handleTabCompletion('cd', tokens[1]);
        } else if (tokens[0] === 'cat' && tokens[1]) {
            handleTabCompletion('cat', tokens[1]);
        }
    }
});

function handleTabCompletion(command, partial) {
    let possibilities = [];
    if (command === 'cd') {
        possibilities = dirTree[curDir].filter(dir => dir.startsWith(partial));
    } else if (command === 'cat') {
        possibilities = dirTree[curDir].filter(file => file.startsWith(partial) && !dirs.includes(file));
    }

    if (possibilities.length === 1) {
        input.value = `${command} ${possibilities[0]}`;
    } else if (possibilities.length > 1) {
        const commonPrefix = getCommonPrefix(possibilities);
        if (commonPrefix.length > partial.length) {
            input.value = `${command} ${commonPrefix}`;
        } else {
            const newLine = document.createElement('code');
            newLine.textContent = possibilities.join(' ');
            newLine.classList.add('no-indent');
            output.insertBefore(newLine, cmdLine);
            const br = document.createElement('br');
            output.insertBefore(br, cmdLine);
        }
    }
}

input.addEventListener('input', () => {
    input.focus();
});

function getCommonPrefix(strings) {
    if (!strings.length) return '';
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
        while (!strings[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
            if (prefix === '') return '';
        }
    }
    return prefix;
}