chrome.tabs.getSelected(null, tab => {
	if (tab.url.includes('teams.microsoft.com')) {
		document.querySelector('.disclaimer').classList.add('hidden');

		document.querySelector('.route').addEventListener('click', () => {
			chrome.tabs.sendMessage(tab.id, {
				action: 'fetchMessages'
			}, response => {
				for (let i=response.length-1 ; i>=0 ; i--) {
					let msg_i = response[i].trim();
					if (msg_i.startsWith('/route')) {
						const roomId = msg_i.substr(6).trim();
						const message = {
						    to: 'EXPO_ID',
						    sound: 'default',
						    title: 'Destination ID',
						    body: 'Destination ID for MS Move About App',
						    data: { dest: roomId },
						};
						const proxyurl = "https://cors-anywhere.herokuapp.com/";
						const url = 'https://exp.host/--/api/v2/push/send';
						fetch(proxyurl + url, {
						    method: 'POST',
						    headers: {
						      	Accept: 'application/json',
						      	'Accept-encoding': 'gzip, deflate',
						      	'Content-Type': 'application/json',
						      	'Access-Control-Allow-Origin': '*'
						    },
						    body: JSON.stringify(message),
						})
						.then((response) => {
							console.log(response);
							console.log('Push Notification Sent!');
						})
						.catch(err => {
							console.log('Error');
							console.log(err);
						});
						break;
					}
				}
			});
		});
	}
});