async function getJoke(category) {
    try {
        const response = await fetch(`/joke/${category}`);
        const html = await response.text();
        document.getElementById('jokeContainer').innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
    }
}