async function sendMessage(message) {
	await fetch('https://exp.host/--/api/v2/push/send', {
	    method: 'POST',
	    headers: {
	      	Accept: 'application/json',
	      	'Accept-encoding': 'gzip, deflate',
	      	'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(message),
	});
}

chrome.tabs.getSelected(null, tab => {
	if (tab.url.includes('teams.microsoft.com')) {
		document.querySelector('.disclaimer').classList.add('hidden');

		document.querySelector('.route').addEventListener('click', () => {
			chrome.tabs.sendMessage(tab.id, {
				action: 'fetchMessages'
			}, response => {
				console.log(response);
				for (let i=response.length-1 ; i>=0 ; i--) {
					let msg_i = response[i].trim();
					console.log(msg_i);
					if (msg_i.startsWith('/route')) {
						const roomId = msg_i.substr(6).trim();
						const message = {
						    to: 'EXPO_ID',
						    sound: 'default',
						    title: 'Destination ID',
						    body: 'Destination ID for MS Move About App',
						    data: { dest: roomId },
						};
						sendMessage(message)
						.then(() => {
							console.log('Push Notification Send!');
						})
						.catch(err => {
							console.log('Error');
							console.log(err);
						})
						break;
					}
				}
			});
		});
	}
});