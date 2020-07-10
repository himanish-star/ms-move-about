const getMessages = () => {
	return Array.from(document.querySelectorAll('.message-body-content')).map(msg => msg.innerText);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'fetchMessages') {
		sendResponse(getMessages());
	}
});

window.onload = () => {
	setTimeout(() => {
		const targetNode = document.querySelector('.ts-message-list-container');
		const config = { childList: true };
		const callback = (mutationsList, observer) => {
		    setTimeout(() => {
		    	chrome.runtime.sendMessage({
			    	action: 'receiveMessages',
			    	messages: getMessages()
			    }, () => {
			    	console.log('Message Sent!');
			    });
		    }, 2000);
		};
		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}, 5000);
}