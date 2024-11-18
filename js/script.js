const input = document.getElementById('input');
const output = document.getElementById('output');
const cursor = document.getElementById('cursor');

const dirTree = {
    'welcome': ['projects', 'resume', 'aboutme.txt'],
    'projects': ['embedded', 'web'],
    'embedded': ['WIoT'],
    'web': ['vermontirrigation', 'wastewatch', 'nytimes_puzzle_solvers'],
};
const dirs = ['welcome', 'projects', 'embedded', 'web'];
let curDir = 'welcome';

window.onload = function () {
    const header = document.getElementById("name-text");
    const msg = document.getElementById('msg-text');
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

function handleLS(output, cmdLine) {
    const results = dirTree[curDir];
    if (results) {
        const newLine = document.createElement('div');
        newLine.id = 'ls-return-div';
        for (const result of results) {
            console.log(result);
            const newElement = document.createElement('code');
            newElement.innerText = `${result}`;
            if (dirs.includes(result)) {
                newElement.style.color = 'red';
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
    const curDirFiles = dirTree[curDir];
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
    --- ls\n
    --- cd\n
    --- cat\n
    --- clear`;
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


    output.scrollTop = output.scrollHeight;
}

input.addEventListener('focus', () => {
    input.style.outline = 'none';
});

input.addEventListener('keydown', (e) => {
    console.log("enter pressed");
    if (e.key === 'Enter') {
        e.preventDefault();
        const command = input.value;
        handleCommand(command);
        input.value = '';
    }
});

input.addEventListener('input', () => {
    input.focus();
});

