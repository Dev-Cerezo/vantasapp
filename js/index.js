if (!localStorage.getItem('emailActivo')) {
    window.location.href = "login.html";
  }

   const N8N_WEBHOOK_URL = 'https://usuariocerezo.app.n8n.cloud/webhook/95643ab0-7e3e-4132-9f7f-afebe7f640fa';

  async function sendMessage() {
    const input = document.getElementById('userInput');
    const container = document.getElementById('chatContainer');
    const selectorMonitoreo = document.getElementById('monitoreoManual');
    const selectorSucursal = document.getElementById('Sucursal');

    const userText = input.value.trim();
    if (!userText) return;

    // CAPTURA DE VALORES ACTUALES
    const contextValue = selectorMonitoreo.value;
    const sucursalValue = selectorSucursal.value;

    // 1. Mostrar mensaje del usuario
    appendMessage('user', userText);
    input.value = "";
    
    // 2. Mostrar indicador de carga
    const loadingDiv = appendMessage('bot', 'Consultando con IA <span class="loading-dots"></span>');

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: contextValue,
          sucursal: sucursalValue, // Campo agregado correctamente
          usuario: localStorage.getItem("emailActivo"),
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Error en respuesta');

      const data = await response.json();
      
      // Eliminar el mensaje de carga
      loadingDiv.remove();

      // Procesar respuesta de n8n (ajustar según la estructura de tu JSON de salida)
      const reply = data.output || data.reply || data.message || 'Respuesta procesada correctamente.';
      appendMessage('bot', reply);

    } catch (error) {
      if (loadingDiv) loadingDiv.remove();
      appendMessage('bot', '❌ Error de conexión. Por favor, intenta de nuevo.');
      console.error("Error en la petición:", error);
    }
  }

  function appendMessage(role, text) {
    const container = document.getElementById('chatContainer');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${role}`;
    
    if (role === 'bot') {
      // Usar marked para renderizar tablas y markdown de la IA
      msgDiv.innerHTML = marked.parse(text);
    } else {
      msgDiv.textContent = text;
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    return msgDiv;
  }

  // Escuchar tecla Enter
  document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });