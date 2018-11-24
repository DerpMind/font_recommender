// console.log(document.getElementsByClassName('container'))


async function some_example(parameter){

	console.log('we made a function', parameter)
	const resp = await fetch('/closest-neighbors', {
		method:'POST', 
		headers: new Headers({
			Accept:'application/json', 
			'Content-Type':'application/json'
		}),
		body: JSON.stringify({
			font_name: parameter
		})
	})
	const body = await resp.json()
	console.log('Result', body) //body should be an array of path names
	
}