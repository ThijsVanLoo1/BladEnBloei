import {micromark} from 'https://esm.sh/micromark@3?bundle'

window.addEventListener('load', init);

function init() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', chatResponse);
}

async function chatResponse(e) {
    e.preventDefault();

    const input = document.getElementById('prompt');
    const message = input.value.trim();
    if (!message) return;

    // Voeg user prompt toe
    addMessage(message, 0, "user");

    input.value = "";

    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ prompt: message })
    });

    const data = await response.json();

    // Voeg bot reactie toe
    addMessage(data.message, data.tokens, "bot");
}

function addMessage(text, tokens, sender) {
    const chat = document.querySelector('.chat');

    const bubble = document.createElement('div');
    const textField = document.createElement('div');
    const tokenAmount = document.createElement('p');
    bubble.classList.add('bubble', sender);
    tokenAmount.classList.add('tokens', sender)

    if (sender === "bot") {
        textField.innerHTML = micromark(text);
        tokenAmount.innerText = `Tokens: ${tokens}`;
    } else {
        textField.innerHTML = micromark(text);
    }

    bubble.appendChild(textField);
    bubble.appendChild(tokenAmount);

    chat.appendChild(bubble);

    // automatisch scrollen
    chat.scrollTop = chat.scrollHeight;
}