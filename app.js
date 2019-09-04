// Book Class
class Game {
  constructor(title, platform, genre){
    this.title = title;
    this.platform = platform;
    this.genre = genre;
  }
}

// UI Class
class UI {
  static displayGames() { 
    // const StoredGames = [
    //   {
    //     title: 'FF7',
    //     platform:'PS',
    //     genre: 'RPG'
    //   },
    //   {
    //     title: 'Super Smash Bros',
    //     platform: 'Switch',
    //     genre: 'Fighting'
    //   }
    // ];
    // const games = StoredGames;
    const games = Store.getGames();
    games.forEach(game => UI.addGameToList(game))
  }

  static addGameToList(game) {
    const list = document.querySelector('#game-list');
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${game.title}</td>
    <td>${game.platform}</td>
    <td>${game.genre}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `
    list.appendChild(row);
  }

  static deleteGame(game) {
    if(game.classList.contains('delete')){
      game.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#game-form');
    container.insertBefore(div, form);
    // Remove Alert
    setTimeout(() => {
      document.querySelector('.alert').remove()
    }, 3000)

  }
}

// Store Class
class Store {
  static getGames(){
    let games;
    if(localStorage.getItem('games') === null){
      games = [];
    } else {
      games = JSON.parse(localStorage.getItem('games'));
    }
    return games;
  }
  static addGame(game){
    const games = Store.getGames();
    games.push(game);
    localStorage.setItem('games', JSON.stringify(games));
  }
  static removeGame(title){
    const games = Store.getGames();
    games.forEach((game, index) => {
      if(game.title === title) {
        games.splice(index, 1);
      }
    });
    localStorage.setItem('games', JSON.stringify(games))
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayGames());

// Event: Add a Game
document.querySelector('#game-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const platform = document.querySelector('#platform').value;
  const genre = document.querySelector('#genre').value;

  // Validate
  if(title === '' || platform === '' || genre === '') {
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate book
  const game = new Game(title, platform, genre);

  // Add Book to UI
  UI.addGameToList(game);
  document.querySelector('#game-form').reset();

  // Add book to store
  Store.addGame(game);

  // Show Successs message
  UI.showAlert('Game Added', 'success');
  }
})

// Event: Remove a Book
document.querySelector('#game-list').addEventListener('click', (e) => {
  UI.deleteGame(e.target);

  // Remove from store
  Store.removeGame(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

  // Success Message
  UI.showAlert('Game Removed', 'success');
})
