
async function some_example() {
	const clicked_element_parent = this.event.target.parentNode; //this preserves the object that got clicked on
	const resp = await fetch('/closest-neighbors', { //closest-neighbors has a route handler in routes.py that finds the nearest neighbors
		method:'POST',
		headers: new Headers({
			Accept:'application/json', 
			'Content-Type':'application/json'
		}),
		body: JSON.stringify({
			font_name: this.event.target.attributes['x-path'].value //this json object will be sent to server, which is the path of the font file that was clicked on
		})
	})
	const body = await resp.json() //body is what the server sends back after finishing post request

	for (const name of body.font_names){ //this for loop creates new html elements and prints their names on the screen right underneath the font
		const new_elem = document.createElement('p')
		new_elem.innerText = name
		clicked_element_parent.appendChild(new_elem);
	}
}

