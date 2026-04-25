import {micromark} from 'https://esm.sh/micromark@3?bundle'

window.addEventListener('load', init);

function init() {
    const form = document.querySelector('.form');
    form.addEventListener('submit', chatResponse);
}

async function chatResponse(e) {
    e.preventDefault();

    const input = document.getElementById('prompt');
    const button = document.querySelector('button');

    const message = input.value.trim();
    if (!message) return;

    button.disabled = true;
    button.innerText = "Versturen..."

    addMessage(message, 0, "user");

    input.value = "";

    const loadingBubble = addMessage("🌱 Even nadenken...", 0, "bot");

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ prompt: message })
        });

        const data = await response.json();

        loadingBubble.remove();
        addMessage(data.message, data.tokens, "bot");

    } catch (err) {
        loadingBubble.remove();
        addMessage("Er ging iets mis 🌧️", 0, "bot");
    }

    button.disabled = false;
    button.innerText = "Verstuur";
}

function addMessage(text, tokens, sender) {
    const chat = document.querySelector('.chat');

    const bubble = document.createElement('div');
    const textField = document.createElement('div');
    const tokenAmount = document.createElement('p');

    bubble.classList.add('bubble', sender);
    tokenAmount.classList.add('tokens', sender);

    textField.innerHTML = micromark(text);

    if (sender === "bot") {
        tokenAmount.innerText = `Tokens: ${tokens}`;
    }

    bubble.appendChild(textField);
    bubble.appendChild(tokenAmount);

    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;

    return bubble;
}