export function renderLog(messages) {
  const container = document.getElementById('game-log');
  if (!container) return;
  
  container.innerHTML = '';
  
  messages.forEach((msg, index) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'log-message';
    messageElement.innerHTML = `
      <span class="log-time">${msg.timestamp}</span>
      <span class="log-text">${msg.message}</span>
    `;
    container.appendChild(messageElement);
  });
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

export function addLogMessage(message, messages) {
  messages.push({
    message,
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Keep only last 50 messages
  if (messages.length > 50) {
    messages.shift();
  }
  
  renderLog(messages);
}

export function createLogEntry(type, details) {
  const templates = {
    'draw_card': (player, card) => `${player} draws ${card.name}`,
    'play_card': (player, card) => `${player} plays ${card.name}`,
    'summon': (player, minion) => `${player} summons ${minion.name}`,
    'attack': (attacker, defender, damage) => `${attacker.name} attacks ${defender.name} for ${damage} damage`,
    'damage': (target, damage) => `${target.name} takes ${damage} damage`,
    'heal': (target, healing) => `${target.name} is healed for ${healing}`,
    'death': (minion) => `${minion.name} dies`,
    'turn_start': (player) => `${player}'s turn starts`,
    'turn_end': (player) => `${player}'s turn ends`,
    'hero_power': (player, power) => `${player} uses ${power}`,
    'game_over': (winner) => `Game Over! ${winner} wins!`
  };
  
  const template = templates[type];
  if (template) {
    return template(...details);
  }
  
  return `Unknown action: ${type}`;
}

export function highlightLastMessage(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const messages = container.querySelectorAll('.log-message');
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    lastMessage.classList.add('highlight');
    
    setTimeout(() => {
      lastMessage.classList.remove('highlight');
    }, 2000);
  }
}

export function filterLogMessages(messages, filter) {
  if (!filter) return messages;
  
  return messages.filter(msg => 
    msg.message.toLowerCase().includes(filter.toLowerCase())
  );
}

export function exportLog(messages) {
  const logText = messages.map(msg => 
    `[${msg.timestamp}] ${msg.message}`
  ).join('\n');
  
  const blob = new Blob([logText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `game-log-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  
  URL.revokeObjectURL(url);
}

export function clearLog(messages) {
  messages.length = 0;
  renderLog(messages);
}
