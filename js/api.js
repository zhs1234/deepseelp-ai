import { MessageType, ErrorType } from './types.js';
import { state } from './state.js';
import { addMessage } from './dom.js';

/**
 * 发送消息到API
 * @param {string} message 用户消息内容
 */
export const sendMessage = async (message) => {
    state.setLoading(true);
    state.setError(null);
    
    try {
        const loadingMessage = addMessage('正在思考...', MessageType.AI);
        state.addMessage({ type: MessageType.USER, content: message });

        const response = await fetch(state.settings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.settings.apiKey}`
            },
            body: JSON.stringify({
                model: state.settings.modelName,
                messages: state.getHistory().map(msg => ({
                    role: msg.type === MessageType.USER ? 'user' : 'assistant',
                    content: msg.content
                })),
                temperature: state.settings.temperature,
                max_tokens: state.settings.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error(
                response.status === 401 ? ErrorType.AUTH_ERROR :
                response.status === 0 ? ErrorType.NETWORK_ERROR :
                ErrorType.API_ERROR
            );
        }

        const data = await response.json();
        loadingMessage.remove();

        if (!data.choices || data.choices.length === 0) {
            throw new Error('API响应无效，未返回有效结果');
        }

        const aiMessage = data.choices[0].message.content;
        state.addMessage({ type: MessageType.AI, content: aiMessage });
        addMessage(aiMessage, MessageType.AI);

    } catch (error) {
        console.error('API Error:', error);
        state.setError(error.message);
        
        const loadingMessages = document.querySelectorAll('.ai-message');
        const lastLoadingMessage = loadingMessages[loadingMessages.length - 1];
        if (lastLoadingMessage && lastLoadingMessage.textContent === '正在思考...') {
            lastLoadingMessage.remove();
        }

        const errorMessage = error.message === ErrorType.AUTH_ERROR ? 'API密钥无效，请检查设置。' :
                           error.message === ErrorType.NETWORK_ERROR ? '网络连接失败，请检查网络。' :
                           '抱歉，发生了错误，请稍后重试。';
        
        addMessage(errorMessage, MessageType.AI);
    } finally {
        state.setLoading(false);
    }
};
