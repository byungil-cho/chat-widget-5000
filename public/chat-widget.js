(function () {
  const socket = io("https://orcax-chat-widget.onrender.com");
  const API_BASE = "https://orcax-chat-widget.onrender.com";

  const style = `
    #orcax-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #00cfff;
      color: black;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 9999;
    }
    #orcax-widget-box {
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 300px;
      height: 400px;
      background: #1e2a38;
      color: white;
      padding: 10px;
      border-radius: 10px;
      display: none;
      flex-direction: column;
      z-index: 9999;
    }
    #orcax-log {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 10px;
    }
    #orcax-log .message {
      margin-bottom: 6px;
    }
    #orcax-form input {
      width: 100%;
      padding: 6px;
      border-radius: 4px;
      border: none;
      margin-bottom: 4px;
    }
    #orcax-form button {
      width: 100%;
      padding: 6px;
      background: #00cfff;
      color: black;
      border: none;
      border-radius: 4px;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.innerText = style;
  document.head.appendChild(styleEl);

  const btn = document.createElement('button');
  btn.id = 'orcax-widget-button';
  btn.innerText = '💬 OrcaX';
  document.body.appendChild(btn);

  const box = document.createElement('div');
  box.id = 'orcax-widget-box';
  box.innerHTML = `
    <div id="orcax-log"><p>위젯 연결 중...</p></div>
    <form id="orcax-form">
      <input id="orcax-nickname" placeholder="닉네임" required />
      <input id="orcax-content" placeholder="메시지" required />
      <button type="submit">보내기</button>
    </form>
  `;
  document.body.appendChild(box);

  btn.onclick = () => {
    box.style.display = box.style.display === 'none' ? 'flex' : 'none';
  };

  const logEl = document.getElementById('orcax-log');

  function addMessage(msg) {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerText = `[${msg.nickname}] ${msg.content}`;
    logEl.appendChild(div);
    logEl.scrollTop = logEl.scrollHeight;
  }

  async function fetchMessages() {
    try {
      const res = await fetch(`${API_BASE}/api/messages`);
      const messages = await res.json();
      logEl.innerHTML = '';
      messages.reverse().forEach(addMessage);
    } catch (err) {
      logEl.innerHTML = '<p>❌ 메시지 불러오기 실패</p>';
    }
  }

  document.getElementById('orcax-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nickname = document.getElementById('orcax-nickname').value;
    const content = document.getElementById('orcax-content').value;
    const payload = { nickname, content, type: 'user' };

    try {
      await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      socket.emit('new-message', payload);
      document.getElementById('orcax-content').value = '';
    } catch (err) {
      alert('메시지 전송 실패');
    }
  });

  socket.on('new-message', addMessage);

  fetchMessages();
})();
