chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'fetchMessages') {
		const messages = Array.from(document.querySelectorAll('.message-body-content')).map(msg => msg.innerText);
		sendResponse(messages);
	}
});