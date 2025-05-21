(function () {
  const apiUrl = 'http://localhost:5000/api/messages'; // 배포 시 수정 가능

  const container = document.createElement('div');
  container.id = 'orcax-widget';
  container.style = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 600px;
    z-index: 9999;
    font-family: sans-serif;
  `;
  document.body.appendChild(container);

  const ticker = document.createElement('div');
  ticker.id = 'orcax-ticker';
  ticker.style = `
    padding: 10px 20px;
    background: rgba(0,0,0,0.7);
    color: white;
    border-radius: 10px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  `;
  container.appendChild(ticker);

  const inputContainer = document.createElement('div');
  inputContainer.innerHTML = `
    <input id="orcax-nick" placeholder="닉네임" style="width: 30%; margin-right: 10px;">
    <input id="orcax-msg" placeholder="하고 싶은 말" style="width: 50%; margin-right: 10px;">
    <button id="orcax-send">보내기</button>
    <button id="orcax-hide">감추기</button>
  `;
  container.appendChild(inputContainer);

  async function fetchMessages() {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (Array.isArray(data)) {
        const msg = data[0];
        ticker.textContent = `[${msg.nickname}] ${msg.content}`;
      }
    } catch (err) {
      ticker.textContent = '메시지를 불러올 수 없습니다.';
    }
  }

  setInterval(fetchMessages, 5000);
  fetchMessages();

  document.getElementById('orcax-send').onclick = async () => {
    const nickname = document.getElementById('orcax-nick').value;
    const content = document.getElementById('orcax-msg').value;
    if (!nickname || !content) return alert('닉네임과 메시지를 입력하세요.');

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, content })
    });

    if (res.ok) {
      document.getElementById('orcax-msg').value = '';
      fetchMessages();
    }
  };

  document.getElementById('orcax-hide').onclick = () => {
    container.style.display = 'none';
  };
})();
