const sendNotification = async (messages) => {
	for (let i=messages.length-1 ; i>=0 ; i--) {
		let msg_i = messages[i].trim();
		if (msg_i.startsWith('/route')) {
			const roomId = msg_i.substr(6).trim();
			const message = {
			    to: 'ExponentPushToken[IUbUT6PZOruE8cKuooKPBc]',
			    sound: 'default',
			    title: 'Destination ID',
			    body: 'Destination ID for MS Move About App',
			    data: { dest: roomId },
			};
			const proxyurl = "https://cors-anywhere.herokuapp.com/";
			const url = 'https://exp.host/--/api/v2/push/send';
			return await fetch(proxyurl + url, {
			    method: 'POST',
			    headers: {
			      	Accept: 'application/json',
			      	'Accept-encoding': 'gzip, deflate',
			      	'Content-Type': 'application/json',
			      	'Access-Control-Allow-Origin': '*'
			    },
			    body: JSON.stringify(message),
			})
			break;
		}
	}
};

chrome.tabs.getSelected(null, tab => {
	if (tab.url.includes('teams.microsoft.com')) {
		document.querySelector('.disclaimer').classList.add('hidden');
		document.querySelector('.route').addEventListener('click', () => {
			chrome.tabs.sendMessage(tab.id, {
				action: 'fetchMessages'
			}, response => {
				sendNotification(response)
				.then(() => {
					console.log('Notification Sent!');
				})
			});
		});
	}
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
	if (request.action === 'receiveMessages') {
		sendNotification(request.messages)
		.then(() => {
			console.log('Notification sent!');
			callback();
		})
		.catch(err => {
			console.log(err);
		});
	}
});

