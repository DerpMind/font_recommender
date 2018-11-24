
async function some_example() {
	const clicked_element_parent = this.event.target.parentNode;
	const resp = await fetch('/closest-neighbors', {
		method:'POST', 
		headers: new Headers({
			Accept:'application/json', 
			'Content-Type':'application/json'
		}),
		body: JSON.stringify({
			font_name: this.event.target.attributes['x-path'].value
		})
	})
	const body = await resp.json()

	for (const name of body.font_names){
		const new_elem = document.createElement('p')
		new_elem.innerText = name
		clicked_element_parent.appendChild(new_elem);
	}
	console.log('Result', body) //body should be an array of path names
}

