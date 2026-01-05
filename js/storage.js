export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function saveFavorite(city) {
    const favs = getFavorites();
    if (!favs.includes(city)) {
        favs.push(city);
        localStorage.setItem("favorites", JSON.stringify(favs));
    }
}

export function removeFavorite(city) {
    const favs = getFavorites().filter(c => c !== city);
    localStorage.setItem("favorites", JSON.stringify(favs));
}
