const appConstants = {
  size: {
    WIDTH: window.innerWidth || 800,
    HEIGHT: window.innerHeight || 600,
  },
  hero: {
    MAX_FOLLOWERS: 5,
    SPEED: 0.01,
    RADIUS: 20,
  },
  animal: {
    SPEED: 0.0002,
    PATROL_DISTANCE: 50,
    PATROL_DELAY: 2000,
    RADIUS: 10,
  },
  yard: {
    WIDTH: 100,
    HEIGHT: 100,
  },
  game: {
    INITIAL_ANIMALS: 5,
    MAX_ANIMALS: 10,
    SPAWN_INTERVAL: 3000,
  },
};

export default appConstants;
